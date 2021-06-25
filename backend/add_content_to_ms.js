const { MeiliSearch } = require("meilisearch")

const client = new MeiliSearch({
    host: "http://localhost:7700",
    apiKey: "masterKey",
});

const fs = require('fs');
fs.readFile('pyq_scrapers/content.json', async (err, data) => {
    if (err) throw err;
    let json_data = JSON.parse(data)["content"];
    let array_length = json_data.length;
    for(let i = 0; i < array_length; i++) {
        
        json_data[i]["id"] = i
        // console.log(json_data[i])
        const x = await client.index('content').addDocuments([ json_data[i] ])
        console.log("added ",x)
    } 

});


