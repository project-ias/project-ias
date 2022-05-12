# Setup up locally

## Setting up React Frontend

1. Change the directory to `frontend` - `cd frontend`
2. Install node modules using **yarn** - `yarn`
3. Start the react server - `yarn start`

## Setting up Node JS backend

1. Change the directory to `backend`
2. Install node modules using **npm** - `npm install`
3. Start the Node JS server using nodemon - `nodemon index.js`

**Note: The frontend is connected to the MeiliSearch hosted on the Server, which is filled with the Updated Data. This is done so that developer doesn't have to refill the Database on his/her own. If you want to setup the database, here are the instructions**

## Setting up MeiliSearch

MeiliSearch is the Search Database, where we store all our PYQs, DNS and Reading Content. To intall and Launch Meilisearch

```
# Install MeiliSearch
curl -L https://install.meilisearch.com | sh

# Launch MeiliSearch
./meilisearch
```

## Adding Documents to MeiliSearch

The data has been stored in the form of JSON files in the `backend/pyq-scrapers` folder. There are some JS scripts in `backend` folder in the format of `add_*_to_ms.js`. You can run the scripts individually to add documents to MeiliSearch. If you wish to add more documents in one of the existing indexes

1. Scrape the Data and store it in a JSON file in the `backend/pyq-scrapers`
2. Find the appropirate file in `backend`. For example, if you want to add dns documents the filename would be `add_dns_to_ms.js`
3. Change the JSON file name in the file found in the above step.
4. Run the JS file to add the data in MeiliSearch - `node FILENAME.js`
   **Note: Please check to which MeiliSearch DB you are adding the DB - Local MeiliSearch DB or Production MeiliSearch DB**

## Deleting an index

1. Change the `indexName` in [this](https://github.com/Neera-AI/project-ias/blob/master/backend/delete_index.js) file
2. Run the file - `node delete_index.js`

# Deployment

- Backend and MeiliSearch are deployed on t2 micro instance.
- Backend runs in background via pm2
- Meilisearch is hosted via ngrok
- Frontend build is automatically created using Netlify.

To deploy

- If you want your changes(backend only) to be deployed. SSH to the server. Run the `deploy.sh` script present in the home directory.
- Frontend will be automatically updated when `master` branch is updated.

# Project Structure

- In `frontend` directory
  - `src/components` contains Components to be displayed
  - All constants are in `src/cnstants/constants.js`
- In `backend` directory
  - `index.js` contains the server code
  - Other `*.js` files add JSON data to MeiliSearch
  - `pyq_scrapers` contains python files to scrape data, along with JSON files containing the data

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
