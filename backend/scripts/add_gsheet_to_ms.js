const axios = require("axios");
const { sheetApi, mainsSheetID, MEILISEARCH_URL } = require("../config/keys");
const crypto = require("crypto");
const { MeiliSearch } = require("meilisearch");

const client = new MeiliSearch({
  host: MEILISEARCH_URL,
  apiKey: "masterKey",
});

const sheetNames = ["GS1", "GS2", "GS3", "GS4"];

async function gsheetToMS() {
  for (var i = 0; i < sheetNames.length; i++) {
    const dataArr = await sheetToJson(mainsSheetID, sheetNames[i]);
    var array_length = dataArr.length;
    for (let i = 0; i < array_length; i++) {
      var idToken = dataArr[i].exam + dataArr[i].year + dataArr[i].qnumber;
      // to preserve the previously stored ids, the 21st century questions will have tokens in different format. E.g. : GS11301
      try {
        if (
          dataArr[i].year !== null &&
          dataArr[i].year[0] == "2" &&
          dataArr[i].year[1] == "0"
        ) {
          if (dataArr[i].qnumber !== null && parseInt(dataArr[i].qnumber) < 10)
            dataArr[i].qnumber = "0" + dataArr[i].qnumber;
          idToken =
            dataArr[i].exam +
            dataArr[i].year[2] +
            dataArr[i].year[3] +
            dataArr[i].qnumber;
        }
      } catch {
        idToken = dataArr[i].exam + dataArr[i].year + dataArr[i].qnumber;
      }
      const id = crypto.createHash("sha256").update(idToken).digest("hex");
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
      qnumber: mainArr[i][2],
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
