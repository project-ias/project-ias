const axios = require("axios");
const { sheetApi, prelimsSheetID } = require("./config/keys");
const crypto = require("crypto");
const { MeiliSearch } = require("meilisearch");
const keys = require("./config/keys");

const client = new MeiliSearch({
  host: keys.MEILISEARCH_URL,
  apiKey: "masterKey",
});

const sheetNames = ["2020", "2019", "2018", "2017", "2016", "2015"];

async function gsheetToMS() {
  for (var i = 0; i < sheetNames.length; i++) {
    const dataArr = await sheetToJson(prelimsSheetID, sheetNames[i]);
    var array_length = dataArr.length;
    for (let i = 0; i < array_length; i++) {
      var idToken = dataArr[i].year + dataArr[i].qnumber;
      const id = crypto.createHash("sha256").update(idToken).digest("hex");
      dataArr[i]["id"] = id;
      // console.log(dataArr[i]);
      const x = await client.index("prelims_sheet").addDocuments([dataArr[i]]);
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
  const mainArr = data.values;
  var convertedArr = [];
  for (var i = 1; i < mainArr.length; i++) {
    if (mainArr[i][2] == undefined) continue;
    const tempObject = {
      qnumber: mainArr[i][0],
      section: mainArr[i][1],
      question: mainArr[i][2],
      options: mainArr[i][3].split(";"),
      correct: mainArr[i][4],
      solution: mainArr[i][5],
      year: sheetName,
    };
    convertedArr.push(tempObject);
  }
  return convertedArr;
}

gsheetToMS();
