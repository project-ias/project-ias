const axios = require("axios");
const fs = require("fs");
const crypto = require("crypto");
const keys = require("../config/keys");

const sheetNames = ["GS1", "GS2", "GS3", "GS4"];

async function gsheetToTopics() {
  const mainArr = [];
  for (var i = 0; i < sheetNames.length; i++) {
    const topicsArr = await sheetToJson(keys.mainsSheetID, sheetNames[i]);
    const topicsObj = {
      label: sheetNames[i],
      category: "examSubType",
      children: topicsArr,
    };
    mainArr.push(topicsObj);

    // var array_length = dataArr.length;
    // for (let i = 0; i < array_length; i++) {
    //   console.log("test3");
    //   console.log(dataArr[i]);
    //   //   const x = await client.index("pyqs").addDocuments([dataArr[i]]);
    //   //   console.log("added ", x);
    // }
  }
  fs.writeFile(
    "scripts/topics.json",
    JSON.stringify({ label: "Mains", category: "examType", children: mainArr }),
    (err) => {
      if (err) console.log(err);
    }
  );
}

function sheetToSheetAPIUrl(sheetId, sheetName, apiKey) {
  return `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}!A1:Z1000?key=${apiKey}`;
}

async function sheetToJson(sheetId, sheetName) {
  const { data } = await axios.get(
    sheetToSheetAPIUrl(sheetId, sheetName, keys.sheetApi)
  );
  const mainArr = data.values;
  var convertedArr = [];
  for (var i = 1; i < mainArr.length; i++) {
    var tempTopic = "";
    if (
      mainArr[i][4] == undefined ||
      mainArr[i][4] == null ||
      mainArr[i][4].trim().length === 0
    )
      continue;
    else tempTopic = mainArr[i][4];
    var idToken = mainArr[i][0] + mainArr[i][1] + mainArr[i][2];
    // to preserve the previously stored ids, the 21st century questions will have tokens in different format. E.g. : GS11301
    try {
      if (
        mainArr[i][1] !== null &&
        mainArr[i][1][0] == "2" &&
        mainArr[i][1][1] == "0"
      ) {
        if (mainArr[i][2] !== null && parseInt(mainArr[i][2]) < 10)
          mainArr[i][2] = "0" + mainArr[i][2];
        idToken =
          mainArr[i][0] + mainArr[i][1][2] + mainArr[i][1][3] + mainArr[i][2];
      }
    } catch {
      idToken = mainArr[i][0] + mainArr[i][1] + mainArr[i][2];
    }
    const questionID = crypto
      .createHash("sha256")
      .update(idToken)
      .digest("hex");
    tempTopic = tempTopic.split(";");
    for (var j = 0; j < tempTopic.length; j++) {
      const mainTopic = tempTopic[j].split(":")[0].trim();
      var subTopics = tempTopic[j].split(":").slice(1);
      subTopics = subTopics.map((x) => x.trim());

      if (convertedArr.find((x) => x["label"] === mainTopic)) {
        const tempIndex = convertedArr.findIndex(
          (x) => x["label"] === mainTopic
        );
        var tempSubTopics = convertedArr[tempIndex]["children"];
        for (var k = 0; k < subTopics.length; k++) {
          if (tempSubTopics.includes(subTopics[k])) continue;
          else tempSubTopics.push(subTopics[k]);
        }
        convertedArr[tempIndex]["children"] = tempSubTopics;
        convertedArr[tempIndex]["questions"].push(questionID);
      } else {
        const tempTopicObject = {
          label: mainTopic,
          category: "mainTopic",
          children: subTopics,
          questions: [questionID],
        };
        convertedArr.push(tempTopicObject);
      }
    }
  }
  return convertedArr;
}

gsheetToTopics();
