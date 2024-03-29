const crypto = require("crypto");
const { MeiliSearch } = require("meilisearch");
const keys = require("../config/keys");

const client = new MeiliSearch({
  host: keys.MEILISEARCH_URL,
  apiKey: "masterKey",
});

const fs = require("fs");
fs.readFile("scripts/today_raudns.json", async (err, data) => {
  if (err) throw err;
  let json_data = JSON.parse(data)["dns"];
  let array_length = json_data.length;
  for (let i = 0; i < array_length; i++) {
    const id = crypto.randomBytes(20).toString("hex");
    json_data[i]["id"] = id;
    // console.log(json_data[i])
    const x = await client.index("dns").addDocuments([json_data[i]]);
    console.log("added ", x);
  }
});
