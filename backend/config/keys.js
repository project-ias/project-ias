require("dotenv").config();

module.exports = {
  MEILISEARCH_URL: "http://localhost:7700",
  // MEILISEARCH_URL: "https://search.project-ias.com",
  // BACKEND_URL: "http://localhost:5000",
  BACKEND_URL: "https://api.project-ias.com",
  // FRONTEND_URL: "http://localhost:3000",
  FRONTEND_URL: "https://project-ias.com",
  secretOrKey: "neera",
  // TODO : make this key environment variable later on.
  mainsSheetID: "1tdc3glFC8z9eJTIbkKvTk5cvvm-pvELGVnyfiqtClzQ",
  prelimsSheetID: "1aPa_Ru4vCF5uwV22RlbjwKhbII44xowcBO7LsxJ-rP0",
  visionSheetID: "10nZGdtDP8PE6U9Ue2JdudnGaJnuuyEmUpT0bcvYqNhw",
  sheetApi: process.env.GOOGLE_SHEET_API,
  // only viewer access via sheetApi
  slackApiUrl: process.env.SLACK_API_URL,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  SUPERTOKENS_URI: process.env.SUPERTOKENS_URI,
  SUPERTOKENS_APIKEY: process.env.SUPERTOKENS_APIKEY
};
