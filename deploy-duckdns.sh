#!/bin/bash
# DuckDNS Deployment Script voor Botanische Den Boterlaer
# Dit script zet de website online via DuckDNS

# Stop niet bij errors, maar log ze
set +e

# Kleuren voor output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functie om te loggen
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check of we root zijn (voor sommige commando's)
check_root() {
    if [ "$EUID" -ne 0 ]; then 
        log_warn "Sommige commando's vereisen sudo rechten"
    fi
}

# Check of Node.js geïnstalleerd is
check_node() {
    if ! command -v node &> /dev/null; then
        log_error "Node.js is niet geïnstalleerd. Installeer het eerst."
        exit 1
    fi
    log_info "Node.js versie: $(node --version)"
}

# Check of npm beschikbaar is, anders installeren
check_npm() {
    if ! command -v npm &> /dev/null; then
        log_error "npm niet gevonden!"
        log_error "Installeer npm eerst met: sudo apt update && sudo apt install -y npm"
        log_error "Of zie INSTALL_NPM.md voor instructies"
        exit 1
    fi
    log_info "npm versie: $(npm --version)"
}

# Installeren van dependencies
install_dependencies() {
    log_info "Dependencies installeren..."
    cd "/home/hacker/Companys/Creativecore/Websites/Botanische Den Boterlaer"
    if npm install; then
        log_info "Dependencies succesvol geïnstalleerd"
    else
        log_warn "npm install gaf een fout, maar we gaan door..."
    fi
}

# Environment variabelen configureren
setup_env() {
    log_info "Environment variabelen configureren..."
    cd "/home/hacker/Companys/Creativecore/Websites/Botanische Den Boterlaer"
    
    if [ ! -f ".env" ]; then
        log_info ".env bestand aanmaken..."
        # Genereer een random JWT secret
        JWT_SECRET=$(openssl rand -hex 32 2>/dev/null || head -c 32 /dev/urandom | base64 | tr -d '\n')
        
        cat > .env << EOF
NODE_ENV=production
PORT=3000
DATABASE_URL="file:./dev.db"
JWT_SECRET="$JWT_SECRET"
EOF
        log_info ".env bestand aangemaakt met JWT_SECRET"
    else
        log_info ".env bestand bestaat al"
    fi
}

# Database migraties uitvoeren
run_migrations() {
    log_info "Database migraties uitvoeren..."
    cd "/home/hacker/Companys/Creativecore/Websites/Botanische Den Boterlaer"
    npm run db:generate || log_warn "db:generate gefaald, doorgaan..."
    npm run db:migrate || log_warn "db:migrate gefaald, doorgaan..."
}

# Production build maken
build_app() {
    log_info "Production build maken..."
    cd "/home/hacker/Companys/Creativecore/Websites/Botanische Den Boterlaer"
    npm run build
    log_info "Build voltooid!"
}

# PM2 installeren
install_pm2() {
    if ! command -v pm2 &> /dev/null; then
        log_info "PM2 installeren..."
        sudo npm install -g pm2
    else
        log_info "PM2 is al geïnstalleerd"
    fi
}

# DuckDNS configureren
configure_duckdns() {
    log_info "DuckDNS configureren..."
    
    # Probeer eerst uit update-duckdns.sh te lezen
    if [ -f "update-duckdns.sh" ]; then
        # Gebruik sed en cut om de waarden tussen quotes te extraheren
        DUCKDNS_DOMAIN=$(grep '^DUCKDNS_DOMAIN=' update-duckdns.sh | cut -d'"' -f2)
        DUCKDNS_TOKEN=$(grep '^DUCKDNS_TOKEN=' update-duckdns.sh | cut -d'"' -f2)
        
        if [ -n "$DUCKDNS_DOMAIN" ] && [ -n "$DUCKDNS_TOKEN" ] && [ "$DUCKDNS_DOMAIN" != "jouw-subdomein" ] && [ "$DUCKDNS_TOKEN" != "jouw-token-hier" ]; then
            log_info "DuckDNS configuratie gevonden in update-duckdns.sh: $DUCKDNS_DOMAIN"
            # Sla op in duckdns-config.env voor later gebruik
            cat > duckdns-config.env << EOF
DUCKDNS_DOMAIN="$DUCKDNS_DOMAIN"
DUCKDNS_TOKEN="$DUCKDNS_TOKEN"
EOF
            chmod 600 duckdns-config.env
        else
            DUCKDNS_DOMAIN=""
            DUCKDNS_TOKEN=""
        fi
    fi
    
    # Als nog niet gevonden, probeer duckdns-config.env
    if [ -z "$DUCKDNS_DOMAIN" ] || [ -z "$DUCKDNS_TOKEN" ]; then
        if [ -f "duckdns-config.env" ]; then
            log_info "DuckDNS configuratie gevonden in duckdns-config.env, laden..."
            source duckdns-config.env
        fi
    fi
    
    # Als nog steeds niet gevonden, vraag om input
    if [ -z "$DUCKDNS_DOMAIN" ] || [ -z "$DUCKDNS_TOKEN" ]; then
        echo ""
        log_info "Vul je DuckDNS credentials in:"
        read -p "DuckDNS subdomein (zonder .duckdns.org): " DUCKDNS_DOMAIN
        read -sp "DuckDNS token (verborgen): " DUCKDNS_TOKEN
        echo ""
        
        # Sla configuratie op
        cat > duckdns-config.env << EOF
DUCKDNS_DOMAIN="$DUCKDNS_DOMAIN"
DUCKDNS_TOKEN="$DUCKDNS_TOKEN"
EOF
        chmod 600 duckdns-config.env
        log_info "DuckDNS configuratie opgeslagen in duckdns-config.env"
    fi
    
    # Update update-duckdns.sh script
    if [ -f "update-duckdns.sh" ]; then
        # Gebruik een betere sed substitutie die werkt ongeacht de huidige waarde
        if grep -q "DUCKDNS_DOMAIN=\"jouw-subdomein\"" update-duckdns.sh; then
            sed -i "s/DUCKDNS_DOMAIN=\"jouw-subdomein\"/DUCKDNS_DOMAIN=\"$DUCKDNS_DOMAIN\"/" update-duckdns.sh
        else
            # Als het al geconfigureerd is, update het opnieuw
            sed -i "s/DUCKDNS_DOMAIN=\".*\"/DUCKDNS_DOMAIN=\"$DUCKDNS_DOMAIN\"/" update-duckdns.sh
        fi
        
        if grep -q "DUCKDNS_TOKEN=\"jouw-token-hier\"" update-duckdns.sh; then
            sed -i "s/DUCKDNS_TOKEN=\"jouw-token-hier\"/DUCKDNS_TOKEN=\"$DUCKDNS_TOKEN\"/" update-duckdns.sh
        else
            sed -i "s/DUCKDNS_TOKEN=\".*\"/DUCKDNS_TOKEN=\"$DUCKDNS_TOKEN\"/" update-duckdns.sh
        fi
        
        chmod +x update-duckdns.sh
        log_info "DuckDNS update script geconfigureerd"
    fi
    
    # Test DuckDNS update
    log_info "DuckDNS IP updaten..."
    if [ -x "./update-duckdns.sh" ]; then
        ./update-duckdns.sh || log_warn "DuckDNS update gefaald, maar we gaan door..."
    else
        log_warn "update-duckdns.sh is niet uitvoerbaar"
    fi
}

# Cron job instellen voor DuckDNS updates
setup_cron() {
    log_info "Cron job instellen voor DuckDNS updates..."
    SCRIPT_PATH="/home/hacker/Companys/Creativecore/Websites/Botanische Den Boterlaer/update-duckdns.sh"
    
    # Check of cron job al bestaat
    if crontab -l 2>/dev/null | grep -q "update-duckdns.sh"; then
        log_info "Cron job bestaat al"
    else
        # Voeg cron job toe (elke 5 minuten)
        (crontab -l 2>/dev/null; echo "*/5 * * * * $SCRIPT_PATH >> /tmp/duckdns-cron.log 2>&1") | crontab -
        log_info "Cron job toegevoegd (elke 5 minuten)"
    fi
}

# Nginx configureren
configure_nginx() {
    log_info "Nginx configureren..."
    
    if ! command -v nginx &> /dev/null; then
        log_warn "Nginx niet gevonden. Installeren..."
        if command -v apt &> /dev/null; then
            sudo apt update && sudo apt install -y nginx || log_warn "Nginx installatie gefaald"
        else
            log_error "Kan Nginx niet installeren. Installeer handmatig."
            return 1
        fi
    fi
    
    # Laad DuckDNS configuratie
    if [ -f "duckdns-config.env" ]; then
        source duckdns-config.env
    else
        log_error "DuckDNS configuratie niet gevonden. Run eerst configure_duckdns"
        return 1
    fi
    
    # Maak Nginx configuratie
    NGINX_CONFIG="/etc/nginx/sites-available/botanische-den-boterlaer"
    sudo tee "$NGINX_CONFIG" > /dev/null << EOF
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
    
    # Maak symlink naar sites-enabled
    sudo ln -sf "$NGINX_CONFIG" /etc/nginx/sites-enabled/botanische-den-boterlaer
    
    # Test Nginx configuratie
    if sudo nginx -t; then
        log_info "Nginx configuratie is geldig"
    else
        log_error "Nginx configuratie heeft fouten!"
        return 1
    fi
    
    # Herstart Nginx
    if sudo systemctl restart nginx; then
        log_info "Nginx herstart"
    else
        log_warn "Nginx herstart gefaald, maar we gaan door..."
    fi
    
    if sudo systemctl enable nginx 2>/dev/null; then
        log_info "Nginx automatisch starten ingeschakeld"
    fi
    
    log_info "Nginx geconfigureerd"
}

# Firewall configureren
configure_firewall() {
    log_info "Firewall configureren..."
    
    # Check welke firewall tool beschikbaar is
    if command -v ufw &> /dev/null; then
        log_info "UFW firewall gevonden, poorten openen..."
        sudo ufw allow 80/tcp 2>/dev/null || log_warn "Kon poort 80 niet openen"
        sudo ufw allow 443/tcp 2>/dev/null || log_warn "Kon poort 443 niet openen"
        sudo ufw --force enable 2>/dev/null || log_warn "UFW kon niet worden geactiveerd (mogelijk al actief)"
        log_info "Firewall geconfigureerd (UFW)"
    elif command -v firewall-cmd &> /dev/null; then
        log_info "firewalld gevonden, poorten openen..."
        sudo firewall-cmd --permanent --add-service=http 2>/dev/null || log_warn "Kon HTTP service niet toevoegen"
        sudo firewall-cmd --permanent --add-service=https 2>/dev/null || log_warn "Kon HTTPS service niet toevoegen"
        sudo firewall-cmd --reload 2>/dev/null || log_warn "Firewalld reload gefaald"
        log_info "Firewall geconfigureerd (firewalld)"
    else
        log_warn "Geen bekende firewall tool gevonden. Zorg ervoor dat poorten 80 en 443 open zijn in je router."
    fi
}

# Applicatie starten met PM2
start_app() {
    log_info "Applicatie starten met PM2..."
    cd "/home/hacker/Companys/Creativecore/Websites/Botanische Den Boterlaer"
    
    # Stop bestaande PM2 processen voor deze app
    pm2 stop botanische-den-boterlaer 2>/dev/null || true
    pm2 delete botanische-den-boterlaer 2>/dev/null || true
    
    # Start applicatie
    if pm2 start ecosystem.config.js; then
        log_info "Applicatie gestart met PM2"
    else
        log_error "PM2 start gefaald!"
        return 1
    fi
    
    # Sla PM2 configuratie op
    pm2 save 2>/dev/null || log_warn "PM2 save gefaald"
    
    # Setup PM2 startup script
    if sudo pm2 startup systemd -u $USER --hp /home/$USER 2>/dev/null; then
        log_info "PM2 startup geconfigureerd"
    else
        log_warn "PM2 startup kon niet worden geconfigureerd (mogelijk al geconfigureerd)"
    fi
    
    pm2 list
}

# Hoofdfunctie
main() {
    log_info "=== DuckDNS Deployment Script ==="
    log_info "Dit script zet de website online via DuckDNS"
    echo ""
    
    check_root
    check_node
    check_npm
    setup_env
    install_dependencies
    run_migrations
    build_app
    install_pm2
    configure_duckdns
    setup_cron
    configure_nginx
    configure_firewall
    start_app
    
    echo ""
    log_info "=== Deployment Voltooid! ==="
    if [ -f "duckdns-config.env" ]; then
        source duckdns-config.env
        log_info "Je website zou nu bereikbaar moeten zijn op: http://${DUCKDNS_DOMAIN}.duckdns.org"
    fi
    log_info "Controleer de status met: pm2 list"
    log_info "Bekijk logs met: pm2 logs"
    log_info "Nginx status: sudo systemctl status nginx"
}

# Run main functie
main

