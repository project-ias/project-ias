//DECREPATED METHOD. For reference only.

const { MeiliSearch } = require("meilisearch");
const crypto = require("crypto");
const keys = require("./config/keys");

const client = new MeiliSearch({
  host: keys.MEILISEARCH_URL,
  apiKey: "masterKey",
});

const fs = require("fs");
fs.readFile("pyq_scrapers/pyqs.json", async (err, data) => {
  if (err) throw err;
  let json_data = JSON.parse(data)["pyqs"];
  let array_length = json_data.length;
  for (let i = 0; i < array_length; i++) {
    const id = crypto.randomBytes(20).toString("hex");
    json_data[i]["id"] = id;

    // seperate topics
    let seperated_topics = [];
    for (let topic of json_data[i]["topics"]) {
      if (topic.includes(";")) {
        // eg - "Historical underpinnings & evolution; Features, amendments, significant provisions, basic structure; Comparison of Indian constitutional scheme with other countries’"
        let split_arr = topic.split(";");
        seperated_topics = seperated_topics.concat(split_arr);
      } else if (topic.includes(",")) {
        // eg -"Salient aspects of Art, Architecture, literature from Ancient to Modern Times"
        let split_arr = topic.split(",");
        seperated_topics = seperated_topics.concat(split_arr);
      } else {
        seperated_topics.push(topic);
      }
    }

    json_data[i]["topics"] = seperated_topics;
    const added = await client.index("pyqs").addDocuments([json_data[i]]);
    console.log("added ", added);
    seperated_topics = [];
  }
});
