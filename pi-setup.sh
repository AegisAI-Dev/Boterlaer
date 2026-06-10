#!/bin/bash
# Master Setup Script voor Botanische Den Boterlaer op Raspberry Pi
# Dit script installeert alle benodigdheden en configureert de website.

set -e

# Kleuren voor output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Forceer Prisma om binaire engines te gebruiken (voorkomt Wasm fouten op Linux)
export PRISMA_CLI_QUERY_ENGINE_TYPE=binary
export PRISMA_CLIENT_ENGINE_TYPE=binary

# Banner
echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║   Botanische Den Boterlaer - Pi Master Setup                 ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# 1. Check for Sudo
if [ "$EUID" -ne 0 ]; then 
    log_error "Dit script moet met sudo worden uitgevoerd!"
    log_info "Gebruik: sudo ./pi-setup.sh"
    exit 1
fi

# 2. Update System
log_step "1. Systeem updaten..."
apt update && apt upgrade -y

# 3. Install Node.js if missing
log_step "2. Node.js installatie controleren..."
if ! command -v node &> /dev/null; then
    log_info "Node.js niet gevonden, installeren via NodeSource..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt install -y nodejs
    log_info "✓ Node.js geïnstalleerd: $(node -v)"
else
    log_info "✓ Node.js is al aanwezig: $(node -v)"
fi

# 4. Install Git and Build-essential
log_step "3. Basis tools installeren..."
apt install -y git build-essential curl wget

# 5. Install Dependencies
log_step "4. Project dependencies installeren..."
OWNER=$(stat -c '%U' .)
# Fix permissions first to ensure we can clean and install
chown -R "$OWNER":"$OWNER" .
chmod -R u+rwX .

log_info "Schoonmaak van oude bestanden..."
rm -rf node_modules package-lock.json

log_info "Dependencies installeren als gebruiker: $OWNER"
sudo -H -u "$OWNER" npm install

# 6. Database and Build
log_step "5. Database en Build voorbereiden..."
# Check for .env file
if [ ! -f ".env" ]; then
    log_warn ".env bestand niet gevonden! Zorg dat je .env overzet of aanmaakt."
    log_info "Kopieer .env.example naar .env indien aanwezig."
fi

# Maak logs directory aan voor PM2
sudo -H -u "$OWNER" mkdir -p logs

log_info "Prisma client genereren (met binaire engine)..."
sudo -E -H -u "$OWNER" npx prisma generate

# Initialiseer database als die nog niet bestaat
if [ ! -f "prisma/dev.db" ]; then
    log_info "Database wordt geïnitialiseerd..."
    sudo -E -H -u "$OWNER" npx prisma db push --skip-generate
fi

sudo -H -u "$OWNER" npm run build
log_info "✓ Build voltooid"

# 7. Install PM2 globally
log_step "6. PM2 (Process Manager) installeren..."
if ! command -v pm2 &> /dev/null; then
    npm install -g pm2
    log_info "✓ PM2 geïnstalleerd"
else
    log_info "✓ PM2 is al aanwezig"
fi

# 8. Setup Nginx
log_step "7. Nginx reverse proxy configureren..."
if [ -f "setup-nginx.sh" ]; then
    chmod +x setup-nginx.sh
    ./setup-nginx.sh
else
    log_error "setup-nginx.sh niet gevonden!"
    exit 1
fi

# 9. Startup Script
log_step "8. Applicatie starten..."
if [ -f "startup.sh" ]; then
    chmod +x startup.sh
    # Starten als de normale gebruiker zodat PM2 processen daar onder vallen
    # Gebruik -H zodat HOME naar de user dir wijst, voorkomt npm errors/crashes
    sudo -H -u "$OWNER" ./startup.sh
else
    log_error "startup.sh niet gevonden!"
    exit 1
fi

# 10. PM2 Startup Persistence
log_step "9. Automatische start bij reboot instellen..."
# Genereer de startup command voor de huidige gebruiker
PM2_STARTUP=$(sudo -H -u "$OWNER" pm2 startup | grep "sudo env PATH" | head -1)
if [ -n "$PM2_STARTUP" ]; then
    eval "$PM2_STARTUP"
    sudo -H -u "$OWNER" pm2 save
    log_info "✓ PM2 persistence ingesteld"
else
    log_warn "Kon PM2 startup commando niet automatisch genereren"
fi

# 11. Final Status
echo ""
log_info "========================================="
log_info "   PI SETUP VOLTOOID!                    "
log_info "========================================="
echo ""
log_info "De website draait nu in de achtergrond."
log_info "Gebruik de volgende commando's als de '$OWNER' gebruiker:"
log_info "  pm2 list          # Check status"
log_info "  pm2 logs          # Bekijk logs"
log_info "  ./startup.sh      # Voor een volledige herstart van de stack"
echo ""
