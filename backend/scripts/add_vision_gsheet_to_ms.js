//While updating the sheet data, delete the old index.

const axios = require("axios");
const { sheetApi, visionSheetID, MEILISEARCH_URL } = require("../config/keys");
const crypto = require("crypto");
const { MeiliSearch } = require("meilisearch");

const client = new MeiliSearch({
  host: MEILISEARCH_URL,
  apiKey: "masterKey",
});

const sheetNames = ["Sheet1"];

async function gsheetToMS() {
  for (var i = 0; i < sheetNames.length; i++) {
    const dataArr = await sheetToJson(visionSheetID, sheetNames[i]);
    var array_length = dataArr.length;
    for (let i = 0; i < array_length; i++) {
      const id = crypto.randomBytes(20).toString("hex");
      dataArr[i]["id"] = id;
      //console.log(dataArr[i]);
      const x = await client.index("vision").addDocuments([dataArr[i]]);
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
  var subject, month, link;
  for (var i = 1; i < mainArr.length; i++) {
    if (mainArr[i][0] == undefined || mainArr[i][3] == undefined) continue;
    subject = mainArr[i][1] == undefined ? "" : mainArr[i][1];
    month = mainArr[i][2] == undefined ? "" : mainArr[i][2];
    link = mainArr[i][3] == undefined ? "" : mainArr[i][3];
    const tempObject = {
      topic: mainArr[i][0],
      subject: subject,
      month: month,
      link: link,
    };
    convertedArr.push(tempObject);
  }
  return convertedArr;
}

gsheetToMS();
