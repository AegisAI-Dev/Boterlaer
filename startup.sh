#!/bin/bash
# Startup Script voor Botanische Den Boterlaer
# Start alle benodigde processen: DuckDNS, PM2, Nginx

set -e

# Kleuren voor output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functies voor logging
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

# Banner
echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║   Botanische Den Boterlaer - Startup Script                  ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Forceer Prisma om binaire engines te gebruiken (voorkomt Wasm fouten op Linux/ARM)
export PRISMA_CLI_QUERY_ENGINE_TYPE=binary
export PRISMA_CLIENT_ENGINE_TYPE=binary

log_step "1. DuckDNS IP Update"
# Laad DuckDNS configuratie
if [ -f "duckdns-config.env" ]; then
    source duckdns-config.env
    log_info "DuckDNS configuratie geladen: $DUCKDNS_DOMAIN"
elif [ -f "update-duckdns.sh" ]; then
    # Haal configuratie uit update-duckdns.sh
    DUCKDNS_DOMAIN=$(grep -oP 'DUCKDNS_DOMAIN="\K[^"]+' update-duckdns.sh | head -1)
    DUCKDNS_TOKEN=$(grep -oP 'DUCKDNS_TOKEN="\K[^"]+' update-duckdns.sh | head -1)
    if [ -n "$DUCKDNS_DOMAIN" ] && [ -n "$DUCKDNS_TOKEN" ]; then
        log_info "DuckDNS configuratie geladen uit update-duckdns.sh"
    else
        log_warn "DuckDNS configuratie niet gevonden, overslaan..."
        DUCKDNS_DOMAIN=""
    fi
else
    log_warn "DuckDNS configuratie niet gevonden, overslaan..."
    DUCKDNS_DOMAIN=""
fi

if [ -n "$DUCKDNS_DOMAIN" ] && [ -n "$DUCKDNS_TOKEN" ]; then
    log_info "Updating DuckDNS voor $DUCKDNS_DOMAIN.duckdns.org..."
    current_ip=$(curl -s https://api.ipify.org)
    if [ -n "$current_ip" ]; then
        update_url="https://www.duckdns.org/update?domains=$DUCKDNS_DOMAIN&token=$DUCKDNS_TOKEN&ip=$current_ip"
        response=$(curl -s "$update_url")
        if [ "$response" = "OK" ]; then
            log_info "✓ DuckDNS succesvol geüpdatet naar IP: $current_ip"
        else
            log_warn "DuckDNS update response: $response"
        fi
    else
        log_error "Kon IP-adres niet ophalen"
    fi
else
    log_warn "DuckDNS configuratie incompleet, overslaan..."
fi

log_step "2. Nginx Controleren"
if command -v nginx &> /dev/null; then
    # Check of Nginx draait
    if systemctl is-active --quiet nginx; then
        log_info "✓ Nginx is al actief"
    else
        log_info "Nginx starten..."
        if sudo -n systemctl start nginx < /dev/null 2>/dev/null; then
            log_info "✓ Nginx gestart"
        else
            log_warn "Kon Nginx niet starten (misschien vereist sudo een wachtwoord?)"
            log_warn "Start Nginx handmatig met: sudo systemctl start nginx"
        fi
    fi
    
    # Check of Nginx configuratie correct is
    if sudo -n nginx -t < /dev/null &>/dev/null; then
        log_info "✓ Nginx configuratie is geldig"
    else
        log_warn "Nginx configuratie heeft problemen, controleer met: sudo nginx -t"
    fi
else
    log_warn "Nginx niet geïnstalleerd"
fi

log_step "3. Node.js en npm Controleren"
if ! command -v node &> /dev/null; then
    log_error "Node.js niet gevonden! Installeer Node.js eerst."
    exit 1
fi

if ! command -v npm &> /dev/null; then
    log_error "npm niet gevonden! Installeer npm eerst."
    exit 1
fi

NODE_VERSION=$(node --version < /dev/null)
NPM_VERSION=$(npm --version < /dev/null)
log_info "✓ Node.js: $NODE_VERSION"
log_info "✓ npm: $NPM_VERSION"

log_step "4. Dependencies Controleren"
if [ ! -d "node_modules" ]; then
    log_warn "node_modules niet gevonden, installeren..."
    npm install
    log_info "✓ Dependencies geïnstalleerd"
else
    log_info "✓ Dependencies aanwezig"
fi

log_step "5. Database Migraties Controleren"
if [ -f "prisma/schema.prisma" ]; then
    log_info "Prisma schema gevonden, genereren client..."
    npm run db:generate 2>&1 | grep -v "^$" || log_warn "Prisma generate gaf waarschuwingen"
    log_info "✓ Prisma client gegenereerd"
else
    log_warn "Prisma schema niet gevonden, overslaan..."
fi

log_step "6. Build Controleren"
if [ ! -d ".next" ]; then
    log_warn ".next directory niet gevonden, builden..."
    npm run build
    log_info "✓ Build voltooid"
else
    log_info "✓ Build aanwezig"
fi

log_step "7. PM2 Starten"
# Check of PM2 geïnstalleerd is
if ! command -v pm2 &> /dev/null; then
    log_warn "PM2 niet gevonden, installeren..."
    sudo -H npm install -g pm2 < /dev/null || {
        log_error "Kon PM2 niet installeren"
        exit 1
    }
    log_info "✓ PM2 geïnstalleerd"
fi

# Check of PM2 daemon draait
if ! pm2 ping &>/dev/null; then
    log_info "PM2 daemon starten..."
    pm2 ping || {
        log_warn "PM2 daemon start gefaald, proberen opnieuw..."
        pm2 kill 2>/dev/null || true
        sleep 1
    }
fi

# Check of applicatie al draait
if pm2 list | grep -q "botanische-den-boterlaer"; then
    log_info "Applicatie draait al, herstarten..."
    pm2 restart botanische-den-boterlaer
    log_info "✓ Applicatie herstart"
else
    log_info "Applicatie starten..."
    if [ -f "ecosystem.config.js" ]; then
        pm2 start ecosystem.config.js
        log_info "✓ Applicatie gestart via ecosystem.config.js"
    else
        log_error "ecosystem.config.js niet gevonden!"
        exit 1
    fi
fi

# Wacht even en check status
sleep 2

log_step "8. Status Controleren"
echo ""
log_info "=== Status Overzicht ==="

# PM2 Status
if pm2 list | grep -q "botanische-den-boterlaer.*online"; then
    log_info "✓ PM2: Applicatie draait"
    pm2 list | grep "botanische-den-boterlaer" | awk '{print "  Status: " $10 " | CPU: " $11 " | Memory: " $12}'
else
    log_error "✗ PM2: Applicatie draait niet!"
    pm2 logs botanische-den-boterlaer --lines 5 --nostream
fi

# Nginx Status
if command -v nginx &> /dev/null && systemctl is-active --quiet nginx; then
    log_info "✓ Nginx: Actief"
else
    log_warn "✗ Nginx: Niet actief"
fi

# DuckDNS Status
if [ -n "$DUCKDNS_DOMAIN" ]; then
    dns_ip=$(dig +short "$DUCKDNS_DOMAIN.duckdns.org" 2>/dev/null | tail -n1)
    if [ -n "$dns_ip" ]; then
        log_info "✓ DuckDNS: $DUCKDNS_DOMAIN.duckdns.org → $dns_ip"
    else
        log_warn "✗ DuckDNS: Kon IP niet resolven"
    fi
fi

# Poort Check
if command -v netstat &> /dev/null; then
    if netstat -tuln 2>/dev/null | grep -q ":3000.*LISTEN"; then
        log_info "✓ Poort 3000: Luistert"
    else
        log_warn "✗ Poort 3000: Niet actief"
    fi
elif command -v ss &> /dev/null; then
    if ss -tuln 2>/dev/null | grep -q ":3000"; then
        log_info "✓ Poort 3000: Luistert"
    else
        log_warn "✗ Poort 3000: Niet actief"
    fi
fi

echo ""
log_info "=== Startup Voltooid ==="
echo ""
log_info "Website URL's:"
log_info "  - Lokaal: http://localhost:3000"
if [ -n "$DUCKDNS_DOMAIN" ]; then
    log_info "  - DuckDNS: http://$DUCKDNS_DOMAIN.duckdns.org"
fi
echo ""
log_info "Handige commando's:"
log_info "  - PM2 logs: pm2 logs botanische-den-boterlaer"
log_info "  - PM2 status: pm2 status"
log_info "  - PM2 restart: pm2 restart botanische-den-boterlaer"
log_info "  - PM2 stop: pm2 stop botanische-den-boterlaer"
echo ""




