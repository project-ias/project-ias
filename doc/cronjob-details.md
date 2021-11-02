# Cronjob

## Flow:
1. Using Github Actions, an endpoint is hit once a day
2. The endpoint runs a bash script
3. The bash scripts first runs a Python Script, then a JS script
4. The Python Scripts creates a JSON file
5. The JS Script adds the data in JSON file to MeiliSearch

Below are the related files for 2 cronjobs - Rau DNS, Dhristi Content

## Updating Rau DNS Daily
- [Cronjob Worflow YML file to hit at `/cron_dns`](https://github.com/Neera-AI/project-ias/blob/master/.github/workflows/raudns.yml)
- [Script that runs when Endpoint `/cron_dns` is hit](https://github.com/Neera-AI/project-ias/blob/master/backend/add_today_dns.sh)
- [Python Script that creates a `today_raudns.json`](https://github.com/Neera-AI/project-ias/blob/master/backend/pyq_scrapers/scrape_today_rau.py)
- [JS Script to add `today_raudns.json` to MeiliSearch](https://github.com/Neera-AI/project-ias/blob/master/backend/add_today_dns.js)

## Updating Dhristi Content Daily
- [Cronjob Worflow YML file to hit at `/cron_dhristi`](https://github.com/Neera-AI/project-ias/blob/master/.github/workflows/dhristi.yml)
- [Script that runs when Endpoint `/cron_dhristi` is hit](https://github.com/Neera-AI/project-ias/blob/master/backend/add_today_dhristi.sh)
- [Python Script that creates a `today_dhristi.json`](https://github.com/Neera-AI/project-ias/blob/master/backend/pyq_scrapers/scrape_today_dhristi.py)
- [JS Script to add `today_dhristi.json` to MeiliSearch](https://github.com/Neera-AI/project-ias/blob/master/backend/add_today_dhristi.js)
