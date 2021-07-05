const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { MeiliSearch } = require("meilisearch")

const app = express();
app.use(express.json());
app.use(cors());
app.options("*", cors());
app.use(morgan("tiny"));

require("dotenv").config();
const client = new MeiliSearch({
    host: "https://6e5aec93d8f8.ngrok.io",
    apiKey: "masterKey",
});

app.get('/', (req, res) => {
    res.send('helo')
})

app.post('/search_pyq', async (req, res) => {
    const query = req.body.query
    
    let search_response;
    search_response = await client.index("pyqs").search(query, {'limit': 50});

    if(search_response.hits.length > 0)  
      res.json(search_response);
    else {
      const search_words_for_right_trim = query.split(" ");
      const search_words_for_left_trim = query.split(" ");

      // Till there is atleast one result, keep trimming words from the query
      while(search_response.hits.length === 0 && (search_words_for_left_trim.length + search_words_for_right_trim.length !== 0)) {
        // initially words are trimmed from the right hand side
        if(search_words_for_right_trim.length !== 0) {
          search_words_for_right_trim.pop()
          const new_query = search_words_for_right_trim.join(' ')
          search_response = await client.index("pyqs").search(new_query);
        }
        // if trimming from right has not fetched any results, words are trimmed from the left hand side
        else {
          search_words_for_left_trim.shift()
          const new_query = search_words_for_left_trim.join(' ')
          search_response = await client.index("pyqs").search(new_query);
        }
      }
      res.json(search_response)
    }
    
})

app.post('/search_content', async (req, res) => {
  const query = req.body.query
  
  let search_response;
  search_response = await client.index("content").search(query, {'limit': 20});

  if(search_response.hits.length > 0)  
    res.json(search_response);
  else {
    const search_words_for_right_trim = query.split(" ");
    const search_words_for_left_trim = query.split(" ");

    // Till there is atleast one result, keep trimming words from the query
    while(search_response.hits.length === 0 && (search_words_for_left_trim.length + search_words_for_right_trim.length !== 0)) {
      // initially words are trimmed from the right hand side
      if(search_words_for_right_trim.length !== 0) {
        search_words_for_right_trim.pop()
        const new_query = search_words_for_right_trim.join(' ')
        search_response = await client.index("content").search(new_query);
      }
      // if trimming from right has not fetched any results, words are trimmed from the left hand side
      else {
        search_words_for_left_trim.shift()
        const new_query = search_words_for_left_trim.join(' ')
        search_response = await client.index("content").search(new_query);
      }
    }
    res.json(search_response)
  }
  
})

app.post('/search_dns', async (req, res) => {
  const query = req.body.query
  
  let search_response;
  search_response = await client.index("dns").search(query, {'limit': 20});

  if(search_response.hits.length > 0)  
    res.json(search_response);
  else {
    const search_words_for_right_trim = query.split(" ");
    const search_words_for_left_trim = query.split(" ");

    // Till there is atleast one result, keep trimming words from the query
    while(search_response.hits.length === 0 && (search_words_for_left_trim.length + search_words_for_right_trim.length !== 0)) {
      // initially words are trimmed from the right hand side
      if(search_words_for_right_trim.length !== 0) {
        search_words_for_right_trim.pop()
        const new_query = search_words_for_right_trim.join(' ')
        search_response = await client.index("dns").search(new_query);
      }
      // if trimming from right has not fetched any results, words are trimmed from the left hand side
      else {
        search_words_for_left_trim.shift()
        const new_query = search_words_for_left_trim.join(' ')
        search_response = await client.index("dns").search(new_query);
      }
    }
    res.json(search_response)
  }
  
})


const PORT = process.env.PORT || 5000;
app.listen(PORT);
console.log(`APP Started on ${PORT}`)
