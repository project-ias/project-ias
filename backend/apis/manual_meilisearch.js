const express = require("express");
const app = express.Router();
const { returnMeiliSearchResults } = require("../meilisearch_results");

app.post("/search_pyq", async (req, res) => {
  const query = req.body.query;
  const length = req.body.length || 50;
  const results = await returnMeiliSearchResults("pyqs", query, length);
  res.json(results);
});

app.post("/search_prelims", async (req, res) => {
  const query = req.body.query;
  const length = req.body.length || 50;
  const results = await returnMeiliSearchResults("prelims", query, length);
  res.json(results);
});

app.post("/search_secure", async (req, res) => {
  const query = req.body.query;
  const length = req.body.length || 50;
  const results = await returnMeiliSearchResults("secure", query, length);
  res.json(results);
});

app.post("/search_content", async (req, res) => {
  const query = req.body.query;
  const length = req.body.length || 20;
  const results = await returnMeiliSearchResults("content", query, length);
  res.json(results);
});

app.post("/search_wfv", async (req, res) => {
  const query = req.body.query;
  const length = req.body.length || 50;
  const results = await returnMeiliSearchResults("wfv", query, length);
  res.json(results);
});

app.post("/search_vision", async (req, res) => {
  const query = req.body.query;
  const length = req.body.length || 50;
  const results = await returnMeiliSearchResults("vision", query, length);
  res.json(results);
});

app.post("/search_dns", async (req, res) => {
  const query = req.body.query;
  const length = req.body.length || 5;
  const results = await returnMeiliSearchResults("dns", query, length);
  res.json(results);
});

module.exports = app;
