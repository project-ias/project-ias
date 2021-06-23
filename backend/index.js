const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const axios = require("axios");
const { MeiliSearch } = require("meilisearch")

const app = express();
app.use(express.json());
app.use(cors());
app.options("*", cors());
app.use(morgan("tiny"));

require("dotenv").config();
const client = new MeiliSearch({
    host: "http://localhost:7700",
    apiKey: "masterKey",
});

app.get('/', (req, res) => {
    res.send('helo')
})

app.post('/search', (req, res) => {
    const query = req.body.query
    res.send(query)
})


const PORT = process.env.PORT || 5000;
app.listen(PORT);
console.log(`APP Started on ${PORT}`)