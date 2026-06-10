#!/bin/bash
# Nginx Setup Script voor Botanische Den Boterlaer
# Dit script configureert Nginx als reverse proxy

set -e

# Kleuren voor output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
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

# Check of we sudo rechten hebben
if [ "$EUID" -ne 0 ]; then 
    log_error "Dit script moet met sudo worden uitgevoerd!"
    log_info "Gebruik: sudo ./setup-nginx.sh"
    exit 1
fi

log_info "=== Nginx Setup Script ==="
log_info "Dit script configureert Nginx als reverse proxy voor de website"
echo ""

# Laad DuckDNS configuratie
DUCKDNS_DOMAIN=""
DUCKDNS_TOKEN=""

# Get directory where this script is located
BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [ -f "$BASE_DIR/duckdns-config.env" ]; then
    source "$BASE_DIR/duckdns-config.env"
    log_info "DuckDNS configuratie geladen: $DUCKDNS_DOMAIN"
else
    log_error "DuckDNS configuratie niet gevonden!"
    log_info "Maak eerst duckdns-config.env aan of voer deploy-duckdns.sh uit"
    exit 1
fi

if [ -z "$DUCKDNS_DOMAIN" ]; then
    log_error "DUCKDNS_DOMAIN is niet ingesteld!"
    exit 1
fi

# Check of Nginx geïnstalleerd is
if ! command -v nginx &> /dev/null; then
    log_warn "Nginx niet gevonden. Installeren..."
    apt update
    apt install -y nginx
    log_info "Nginx geïnstalleerd"
else
    log_info "Nginx is al geïnstalleerd"
fi

# Maak Nginx configuratiebestand
NGINX_CONFIG="/etc/nginx/sites-available/botanische-den-boterlaer"
log_info "Nginx configuratiebestand aanmaken: $NGINX_CONFIG"

cat > "$NGINX_CONFIG" << EOF
server {
    listen 80;
    server_name ${DUCKDNS_DOMAIN}.duckdns.org;

    # Logging
    access_log /var/log/nginx/botanische-access.log;
    error_log /var/log/nginx/botanische-error.log;

    # Max upload size (voor foto uploads)
    client_max_body_size 50M;

    # Proxy naar Next.js applicatie
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        
        # WebSocket support
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        
        # Headers voor correcte proxy functionaliteit
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        
        # Cache bypass
        proxy_cache_bypass \$http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Static files caching
    location /_next/static {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 60m;
        add_header Cache-Control "public, immutable";
    }
}
EOF

log_info "Nginx configuratiebestand aangemaakt"

# Verwijder de standaard Nginx site om conflicten te voorkomen
if [ -f "/etc/nginx/sites-enabled/default" ]; then
    log_info "Standaard Nginx config verwijderen..."
    rm "/etc/nginx/sites-enabled/default"
fi

# Maak symlink naar sites-enabled
NGINX_ENABLED="/etc/nginx/sites-enabled/botanische-den-boterlaer"
if [ -L "$NGINX_ENABLED" ]; then
    log_info "Symlink bestaat al, verwijderen..."
    rm "$NGINX_ENABLED"
fi

ln -s "$NGINX_CONFIG" "$NGINX_ENABLED"
log_info "Symlink gemaakt naar sites-enabled"

# Test Nginx configuratie
log_info "Nginx configuratie testen..."
if nginx -t; then
    log_info "✓ Nginx configuratie is geldig"
else
    log_error "✗ Nginx configuratie heeft fouten!"
    exit 1
fi

# Herstart Nginx
log_info "Nginx herstarten..."
if systemctl restart nginx; then
    log_info "✓ Nginx herstart"
else
    log_error "✗ Nginx herstart gefaald!"
    exit 1
fi

# Enable Nginx bij opstarten
if systemctl enable nginx 2>/dev/null; then
    log_info "✓ Nginx automatisch starten ingeschakeld"
fi

# Check Nginx status
log_info "Nginx status controleren..."
systemctl status nginx --no-pager -l | head -10

echo ""
log_info "=== Nginx Setup Voltooid! ==="
log_info "Je website zou nu bereikbaar moeten zijn op:"
log_info "  http://${DUCKDNS_DOMAIN}.duckdns.org"
echo ""
log_info "Handige commando's:"
log_info "  sudo systemctl status nginx    # Status controleren"
log_info "  sudo systemctl restart nginx   # Herstarten"
log_info "  sudo nginx -t                  # Configuratie testen"
log_info "  sudo tail -f /var/log/nginx/botanische-error.log  # Error logs"
log_info "  sudo tail -f /var/log/nginx/botanische-access.log # Access logs"

