require("dotenv").config();

module.exports = {
  MEILISEARCH_URL: process.env.MEILISEARCH_URL,
  BACKEND_URL: process.env.BACKEND_URL,
  FRONTEND_URL: process.env.FRONTEND_URL,
  secretOrKey: "neera",
  mainsSheetID: "1tdc3glFC8z9eJTIbkKvTk5cvvm-pvELGVnyfiqtClzQ",
  prelimsSheetID: "1aPa_Ru4vCF5uwV22RlbjwKhbII44xowcBO7LsxJ-rP0",
  visionSheetID: "10nZGdtDP8PE6U9Ue2JdudnGaJnuuyEmUpT0bcvYqNhw",
  couponSheetID: "1tIkH0cPwfw5tkknWmxolAoW15cHsjnR30u4cq6gMOdA",
  sheetApi: process.env.GOOGLE_SHEET_API, // only viewer access via sheetApi
  slackApiUrl: process.env.SLACK_API_URL,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  SUPERTOKENS_URI: process.env.SUPERTOKENS_URI,
  SUPERTOKENS_APIKEY: process.env.SUPERTOKENS_APIKEY,
  INSTAMOJO_URL: process.env.INSTAMOJO_URL,
  INSTAMOJO_APIKEY: process.env.INSTAMOJO_APIKEY,
  INSTAMOJO_TOKEN: process.env.INSTAMOJO_TOKEN
};
