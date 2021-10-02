const { MeiliSearch } = require("meilisearch");
const keys = require("../config/keys");

const client = new MeiliSearch({
  host: keys.MEILISEARCH_URL,
  apiKey: "masterKey",
});

client.index("pyqs").updateAttributesForFaceting(["exam", "topics"]);
