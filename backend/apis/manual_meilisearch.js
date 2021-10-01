const express = require("express");
const app = express.Router();
const { returnMeiliSearchResults } = require("../meilisearch_results");

app.post("/search_pyq", async (req, res) => {
  const query = req.body.query;
  const results = await returnMeiliSearchResults("pyqs", query, 50);
  res.json(results);
});

app.post("/search_prelims", async (req, res) => {
  const query = req.body.query;
  const results = await returnMeiliSearchResults("prelims", query, 50);
  res.json(results);
});

app.post("/search_secure", async (req, res) => {
  const query = req.body.query;
  const results = await returnMeiliSearchResults("secure", query, 50);
  res.json(results);
});

app.post("/search_content", async (req, res) => {
  const query = req.body.query;
  const results = await returnMeiliSearchResults("content", query);
  res.json(results);
});

app.post("/search_wfv", async (req, res) => {
  const query = req.body.query;
  const results = await returnMeiliSearchResults("wfv", query, 50);
  res.json(results);
});

app.post("/search_vision", async (req, res) => {
  const query = req.body.query;
  const results = await returnMeiliSearchResults("vision", query, 50);
  res.json(results);
});

app.post("/search_dns", async (req, res) => {
  const query = req.body.query;
  const results = await returnMeiliSearchResults("dns", query, 5);
  res.json(results);
});

module.exports = app;
