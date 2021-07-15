const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { MeiliSearch } = require("meilisearch");
const crypto = require("crypto");
const shell = require('shelljs')
const {returnMeiliSearchResults} = require('./meilisearch_results')

const app = express();
app.use(express.json());
app.use(cors());
app.options("*", cors());
app.use(morgan("tiny"));

require("dotenv").config();
const client = new MeiliSearch({
  host: "https://c85d02128138.ngrok.io",
  apiKey: "masterKey",
});

app.get("/", (req, res) => {
  res.send("helo");
});

app.post("/log", async (req, res) => {
  const query_data = req.body.query_data;
  const id = crypto.randomBytes(20).toString("hex");
  query_data["id"] = id;
  const x = await client.index("query_logs").addDocuments([query_data]);
  res.send("Added");
});

app.get('/cron_dhristi', (req, res) => {
  res.send('Will Start Cronjob to fetch Dhristi Content')
  try {
    shell.exec('bash add_today_dhristi.sh')
   } catch(err) {
    console.log('Error in running bash',err)
   }
   
})

app.get('/cron_dns', (req, res) => {
  res.send('Will Start Cronjob to fetch Rau DNS')
  try {
    shell.exec('bash add_today_dns.sh')
   } catch(err) {
    console.log('Error in running bash',err)
   }
   
})

app.post("/search_pyq", async (req, res) => {
  const query = req.body.query;
  const results = await returnMeiliSearchResults('pyqs', query, 50)
  res.json(results)
});

app.post("/search_prelims", async (req, res) => {
  const query = req.body.query;
  const results = await returnMeiliSearchResults('prelims', query, 50)
  res.json(results)
});

app.post("/search_content", async (req, res) => {
  const query = req.body.query;
  const results = await returnMeiliSearchResults('content', query)
  res.json(results)
});

app.post("/search_dns", async (req, res) => {
  const query = req.body.query;
  const results = await returnMeiliSearchResults('dns', query, 5)
  res.json(results)
  
});

const PORT = process.env.PORT || 5000;
app.listen(PORT);
console.log(`APP Started on ${PORT}`);
