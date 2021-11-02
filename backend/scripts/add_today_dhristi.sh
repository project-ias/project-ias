cd ~/project-ias/backend/pyq_scrapers
python3 -m venv env
source env/bin/activate
pip3 install -r requirements.txt
cd ..

python3 pyq_scrapers/scrape_today_dhristi.py
node scripts/add_today_dhristi.js
deactivate
