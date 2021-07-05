const { MeiliSearch } = require("meilisearch")

const client = new MeiliSearch({
    host: "http://localhost:7700",
    apiKey: "masterKey",
});


const indexName = "pyqs"

client.deleteIndex(indexName)

