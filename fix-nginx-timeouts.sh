#!/bin/bash

# Script om Nginx proxy timeouts te verhogen voor grote video uploads

NGINX_CONFIG="/etc/nginx/sites-available/botanische-den-boterlaer"
BACKUP_FILE="${NGINX_CONFIG}.backup.$(date +%Y%m%d_%H%M%S)"

echo "🔧 Nginx Proxy Timeouts Verhogen"
echo "=================================="
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo "❌ Dit script moet als root/sudo worden uitgevoerd"
    echo "   Gebruik: sudo ./fix-nginx-timeouts.sh"
    exit 1
fi

# Backup current config
if [ -f "$NGINX_CONFIG" ]; then
    echo "📦 Backup maken van huidige configuratie..."
    cp "$NGINX_CONFIG" "$BACKUP_FILE"
    echo "   Backup opgeslagen: $BACKUP_FILE"
else
    echo "❌ Nginx configuratie niet gevonden: $NGINX_CONFIG"
    exit 1
fi

# Update timeouts
echo ""
echo "🔨 Proxy timeouts aanpassen..."
sed -i 's/proxy_connect_timeout 60s;/proxy_connect_timeout 600s;/' "$NGINX_CONFIG"
sed -i 's/proxy_send_timeout 60s;/proxy_send_timeout 600s;/' "$NGINX_CONFIG"
sed -i 's/proxy_read_timeout 60s;/proxy_read_timeout 600s;/' "$NGINX_CONFIG"

# Add client_body_timeout if not present
if ! grep -q "client_body_timeout" "$NGINX_CONFIG"; then
    # Add after client_max_body_size
    sed -i '/client_max_body_size/a\    client_body_timeout 600s;' "$NGINX_CONFIG"
    echo "   ✅ client_body_timeout toegevoegd"
fi

# Verify changes
echo ""
echo "📋 Gecontroleerde timeouts:"
grep -E "proxy_connect_timeout|proxy_send_timeout|proxy_read_timeout|client_body_timeout" "$NGINX_CONFIG" || echo "   ⚠️  Geen timeouts gevonden"

# Test Nginx config
echo ""
echo "🧪 Nginx configuratie testen..."
if nginx -t; then
    echo "   ✅ Nginx configuratie is geldig"
    
    # Reload Nginx
    echo ""
    echo "🔄 Nginx herladen..."
    if systemctl reload nginx; then
        echo "   ✅ Nginx succesvol herladen"
        echo ""
        echo "✨ Klaar! Proxy timeouts zijn nu 10 minuten (600s)"
        echo ""
        echo "📋 Huidige timeout configuratie:"
        grep -E "proxy_connect_timeout|proxy_send_timeout|proxy_read_timeout|client_body_timeout" "$NGINX_CONFIG"
    else
        echo "   ❌ Fout bij herladen van Nginx"
        echo "   Herstel backup met: cp $BACKUP_FILE $NGINX_CONFIG"
        exit 1
    fi
else
    echo "   ❌ Nginx configuratie test gefaald!"
    echo "   Herstel backup met: cp $BACKUP_FILE $NGINX_CONFIG"
    exit 1
fi


