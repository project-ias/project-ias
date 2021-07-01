const { MeiliSearch } = require("meilisearch")
const crypto = require("crypto")

const client = new MeiliSearch({
    host: "http://localhost:7700",
    apiKey: "masterKey",
});

const fs = require('fs');
fs.readFile('pyq_scrapers/pyqs.json', async (err, data) => {
    if (err) throw err;
    let json_data = JSON.parse(data)["pyqs"];
    let array_length = json_data.length;
    for(let i = 0; i < array_length; i++) {
        const id = crypto.randomBytes(20).toString('hex');
        json_data[i]["id"] = id
        // console.log(json_data[i])
        const added = await client.index('pyqs').addDocuments([ json_data[i] ])
        console.log("added ",added)
    } 

});


