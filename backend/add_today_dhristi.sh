cd ~/project-ias/backend/pyq_scrapers
python3 -m venv env
source env/bin/activate
cd ..

python3 pyq_scrapers/scrape_today_dhristi.py
node add_today_dhristi.js
deactivate