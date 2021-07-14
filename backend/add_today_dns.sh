cd ~/0repos/neera/project-ias/backend/pyq_scrapers
python3 -m venv env
source env/bin/activate
pip3 install -r requirements.txt
cd ..

python3 pyq_scrapers/scrape_today_rau.py
node add_today_dns.js
deactivate
