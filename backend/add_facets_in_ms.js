const { MeiliSearch } = require("meilisearch")

const client = new MeiliSearch({
    host: "http://localhost:7700",
    apiKey: "masterKey",
});

client.index('pyqs')
  .updateAttributesForFaceting([
   'exam',
   'topics'
  ])
