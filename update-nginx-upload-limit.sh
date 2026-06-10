#!/bin/bash

# Script om Nginx upload limiet te verhogen voor grote video uploads

NGINX_CONFIG="/etc/nginx/sites-available/botanische-den-boterlaer"
BACKUP_FILE="${NGINX_CONFIG}.backup.$(date +%Y%m%d_%H%M%S)"

echo "🔧 Nginx Upload Limiet Verhogen"
echo "================================"
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo "❌ Dit script moet als root/sudo worden uitgevoerd"
    echo "   Gebruik: sudo ./update-nginx-upload-limit.sh"
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

# Update client_max_body_size
echo ""
echo "🔨 Upload limiet aanpassen..."
sed -i 's/client_max_body_size 50M;/client_max_body_size 10G;/' "$NGINX_CONFIG"

# Verify change
if grep -q "client_max_body_size 10G" "$NGINX_CONFIG"; then
    echo "   ✅ Upload limiet verhoogd naar 10GB"
else
    echo "   ⚠️  Waarschuwing: Wijziging niet gevonden in configuratie"
fi

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
        echo "✨ Klaar! Upload limiet is nu 10GB"
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

echo ""
echo "📋 Huidige configuratie:"
grep "client_max_body_size" "$NGINX_CONFIG"

