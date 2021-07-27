const axios = require("axios");
const { sheetApi, sheetID } = require("./config/keys");
const crypto = require("crypto");
const { MeiliSearch } = require("meilisearch");
const keys = require("./config/keys");

const client = new MeiliSearch({
  host: keys.MEILISEARCH_URL,
  apiKey: "masterKey",
});

const sheetNames = ["GS1", "GS2", "GS3"];

async function gsheetToMS() {
  for (var i = 0; i < sheetNames.length; i++) {
    const dataArr = await sheetToJson(sheetID, sheetNames[i]);
    var array_length = dataArr.length;
    for (let i = 0; i < array_length; i++) {
      const id = crypto
        .createHash("sha256")
        .update(dataArr[i].exam + dataArr[i].qnumber)
        .digest("hex");
      dataArr[i]["id"] = id;
      // console.log(dataArr[i]);
      const x = await client.index("pyqs").addDocuments([dataArr[i]]);
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
    if (mainArr[i][3] == undefined) continue;
    if (mainArr[i][4] == undefined) var tempTopic = "";
    else var tempTopic = mainArr[i][4];
    tempTopic = tempTopic.split(";");
    for (var j = 0; j < tempTopic.length; j++) {
      const tempTopicObject = {
        mainTopic: tempTopic[j].split(":")[0],
        subTopics: tempTopic[j].split(":").slice(1),
      };
      tempTopic[j] = tempTopicObject;
    }
    const tempObject = {
      exam: mainArr[i][0],
      year: mainArr[i][1],
      qnumber: mainArr[i][2].split("_").join(""),
      question: mainArr[i][3],
      words: mainArr[i][5],
      marks: mainArr[i][6],
      topics: tempTopic,
    };
    convertedArr.push(tempObject);
  }
  return convertedArr;
}

gsheetToMS();
