const { UserModel } = require("../models/models");
const slackNotifier = require("./slack_notifier");

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
    slackNotifier(`${email} just signed in`);
  }
};

module.exports = createAccountInMongo;
