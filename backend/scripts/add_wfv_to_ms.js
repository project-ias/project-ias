// wfv - Weekly Focus Vision
//While updating the sheet data, delete the old index.

const axios = require("axios");
const { sheetApi, mainsSheetID, MEILISEARCH_URL } = require("../config/keys");
const crypto = require("crypto");
const { MeiliSearch } = require("meilisearch");

const client = new MeiliSearch({
  host: MEILISEARCH_URL,
  apiKey: "masterKey",
});

const sheetNames = ["WeeklyFocusVisionIAS"];

async function gsheetToMS() {
  for (var i = 0; i < sheetNames.length; i++) {
    const dataArr = await sheetToJson(mainsSheetID, sheetNames[i]);
    var array_length = dataArr.length;
    for (let i = 0; i < array_length; i++) {
      const id = crypto.randomBytes(20).toString("hex");
      dataArr[i]["id"] = id;
      // console.log(dataArr[i]);
      const x = await client.index("wfv").addDocuments([dataArr[i]]);
      console.log("added ", x);
    }
  }
}

function sheetToSheetAPIUrl(sheetId, sheetName, apiKey) {
  return `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}!A1:Z1000?key=${apiKey}`;
}

async function sheetToJson(sheetId, sheetName) {
  const { data } = await axios.get(
    sheetToSheetAPIUrl(sheetId, sheetName, sheetApi)
  );
  const mainArr = data["values"];
  var convertedArr = [];
  for (var i = 1; i < mainArr.length; i++) {
    if (mainArr[i][1] == undefined) continue;
    if (mainArr[i][0] == undefined) var tempTopic = "";
    else var tempTopic = mainArr[i][0];
    const tempObject = {
      topics: tempTopic,
      link: mainArr[i][1],
    };
    convertedArr.push(tempObject);
  }
  return convertedArr;
}

gsheetToMS();
