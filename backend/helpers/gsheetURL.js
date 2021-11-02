const keys = require("../config/keys");

const gsheetURL = (sheetId, sheetName) => {
  return `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}!A1:Z1000?key=${keys.sheetApi}`;
};

module.exports = gsheetURL;
