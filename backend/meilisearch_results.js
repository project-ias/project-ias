const { MeiliSearch } = require("meilisearch");

const client = new MeiliSearch({
    host: "https://c85d02128138.ngrok.io",
    apiKey: "masterKey",
  });

  
async function returnMeiliSearchResults(index, query, limit=20) {
  
  let search_response;
  search_response = await client.index(index).search(query, { limit: limit });
  
  if (search_response.hits.length > 0) {
      return search_response
  }
  
  else {
    const search_words_for_right_trim = query.split(" ");
    const search_words_for_left_trim = query.split(" ");

    // Till there is atleast one result, keep trimming words from the query
    while (
      search_response.hits.length === 0 &&
     (search_words_for_left_trim.length > 1 || search_words_for_right_trim.length > 1)
        
    ) {

      // initially words are trimmed from the right hand side
      if (search_words_for_right_trim.length > 1) {
        
        search_words_for_right_trim.pop();
        const new_query = search_words_for_right_trim.join(" ");
        
        search_response = await client.index(index).search(new_query, { limit: limit });
      }
      // if trimming from right has not fetched any results, words are trimmed from the left hand side
      else if(search_words_for_left_trim.length > 1) {
        search_words_for_left_trim.shift();
        const new_query = search_words_for_left_trim.join(" ");
        search_response = await client.index(index).search(new_query, { limit: limit });
      }
    }
    return search_response
  }
}

exports.returnMeiliSearchResults = returnMeiliSearchResults