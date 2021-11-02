const { UserModel } = require("../models/models");
const { default: axios } = require("axios");
const { slackApiUrl } = require("../config/keys");

const createAccountInMongo = async (email) => {
  const existUser = await UserModel.findOne({ email: email }).exec();
  if (existUser === null) {
    //new user. create entry in mongodb
    const today = new Date();
    const date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();
    let newUser = new UserModel({
      email: email,
      password: "supertokens", //we dont need to save password since its handled by supertokens
      prelims: [],
      mains: [],
      payDate: date,
    });
    newUser.save((err) => console.log(err));
    //update on slack.
    axios
      .post(slackApiUrl, { text: `${email} just signed in` })
      .then()
      .catch((err) => console.log("Error while updating on slack : " + err));
  }
};

module.exports = createAccountInMongo;
