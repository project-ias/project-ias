const { MeiliSearch } = require("meilisearch")

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
        
        json_data[i]["id"] = i
        console.log(json_data[i])
        client.index('pyqs').addDocuments([ json_data[i] ])
        console.log("added ",i)
    } 

});


