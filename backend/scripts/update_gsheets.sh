cd ~/project-ias/backend

node scripts/add_gsheet_to_ms.js
node scripts/add_prelims_gsheet_to_ms.js
echo "Gsheets sync Successful: $(date)" >> /home/ubuntu/cronjob-logs/gsheets-sync.log