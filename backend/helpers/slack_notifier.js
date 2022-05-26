const { default: axios } = require("axios");
const { slackApiUrl } = require("../config/keys");

const slackNotifier = (text) => {
  axios
    .post(slackApiUrl, {
      text,
    })
    .then()
    .catch((err) => console.log("Error while updating on slack : " + err));
};

module.exports = slackNotifier;
