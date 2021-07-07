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
