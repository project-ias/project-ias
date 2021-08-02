cd ~/project-ias/backend

node add_gsheet_to_ms.js
echo "Gsheets sync Successful: $(date)" >> /home/ubuntu/cronjob-logs/gsheets-sync.log