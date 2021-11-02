const crypto = require("crypto");
const { MeiliSearch } = require("meilisearch");
const keys = require("../config/keys");

const client = new MeiliSearch({
  host: keys.MEILISEARCH_URL,
  apiKey: "masterKey",
});

const fs = require("fs");
const filenames = [
  "prelims2015.json",
  "prelims2016.json",
  "prelims2017.json",
  "prelims2018.json",
];

for (let filename of filenames) {
  fs.readFile(`pyq_scrapers/${filename}`, async (err, data) => {
    if (err) throw err;
    let json_data = JSON.parse(data)["prelims"];
    let array_length = json_data.length;
    for (let i = 0; i < array_length; i++) {
      const id = crypto.randomBytes(20).toString("hex");
      json_data[i]["id"] = id;
      // console.log(json_data[i])
      const added = await client.index("prelims").addDocuments([json_data[i]]);
      console.log("added ", added, i);
    }
  });
}
