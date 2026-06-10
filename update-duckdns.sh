#!/bin/bash
# DuckDNS Auto-Update Script voor Linux/Mac
# Dit script update automatisch je IP-adres naar DuckDNS

# CONFIGURATIE - Pas deze aan naar jouw DuckDNS instellingen
DUCKDNS_DOMAIN=""  # Vervang met je DuckDNS subdomein (zonder .duckdns.org)
DUCKDNS_TOKEN=""  # Vervang met je DuckDNS token

# Log file locatie
LOG_FILE="duckdns-update.log"

# Functie om naar log te schrijven
log_message() {
    timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo "$timestamp - $1" | tee -a "$LOG_FILE"
}

# Haal huidig IP-adres op
current_ip=$(curl -s https://api.ipify.org)

if [ -z "$current_ip" ]; then
    log_message "Fout: Kon IP-adres niet ophalen"
    exit 1
fi

log_message "Huidig IP-adres: $current_ip"

# Update DuckDNS
update_url="https://www.duckdns.org/update?domains=$DUCKDNS_DOMAIN&token=$DUCKDNS_TOKEN&ip=$current_ip"
response=$(curl -s "$update_url")

if [ "$response" = "OK" ]; then
    log_message "DuckDNS succesvol geüpdatet naar IP: $current_ip"
else
    log_message "Waarschuwing: DuckDNS update response: $response"
fi

# Optioneel: Check of het IP correct is geüpdatet
dns_ip=$(dig +short "$DUCKDNS_DOMAIN.duckdns.org" | tail -n1)

if [ "$dns_ip" = "$current_ip" ]; then
    log_message "Verificatie geslaagd: DNS IP ($dns_ip) komt overeen met huidig IP ($current_ip)"
else
    log_message "Waarschuwing: DNS IP ($dns_ip) komt niet overeen met huidig IP ($current_ip) - mogelijk nog niet gepropageerd"
fi
