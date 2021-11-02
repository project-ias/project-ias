const crypto = require("crypto");
const { MeiliSearch } = require("meilisearch");
const keys = require("../config/keys");

const client = new MeiliSearch({
  host: keys.MEILISEARCH_URL,
  apiKey: "masterKey",
});

const fs = require("fs");
const filenames = [
  "secure-2020_01.json",
  "secure-2020_02.json",
  "secure-2020_03.json",
  "secure-july-2021.json",
  "secure-july_02.json",
  "secure-july_03.json",
  "secure-july_04.json",
  "secure-july_04.json",
  "secure-aug.json",
];

for (let filename of filenames) {
  fs.readFile(`secure_jsons/${filename}`, async (err, data) => {
    if (err) throw err;
    let json_data = JSON.parse(data);
    let array_length = json_data.length;
    for (let i = 0; i < array_length; i++) {
      const id = crypto
        .createHash("sha256")
        .update(json_data[i].link)
        .digest("hex");
      json_data[i]["id"] = id;
      // console.log(json_data[i])
      const added = await client.index("secure").addDocuments([json_data[i]]);
      //console.log("added ", json_data[i]);
    }
  });
}
