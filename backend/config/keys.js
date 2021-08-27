require("dotenv").config();

module.exports = {
  MEILISEARCH_URL: "http://localhost:7700",
  // MEILISEARCH_URL: "https://search.project-ias.com",
  // BACKEND_URL: "http://localhost:5000",
  BACKEND_URL: "https://api.project-ias.com",
  // FRONTEND_URL: "http://localhost:3000",
  FRONTEND_URL = "https://project-ias.com",
  secretOrKey: "neera",
  // TODO : make this key environment variable later on.
  mainsSheetID: "1tdc3glFC8z9eJTIbkKvTk5cvvm-pvELGVnyfiqtClzQ",
  prelimsSheetID: "1aPa_Ru4vCF5uwV22RlbjwKhbII44xowcBO7LsxJ-rP0",
  sheetApi: "AIzaSyBiCZ0OfgSBTMUHwc4bpwCwKDPc3wGYTOY",
  // only viewer access via sheetApi
  slackApiUrl: process.env.SLACK_API_URL,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  SUPERTOKENS_URI: "https://9eedbb80072411ecb40997c2361f1f3c-us-east-1.aws.supertokens.io:3567",
  SUPERTOKENS_APIKEY: "CeYkYC3CIEJhx40CO97bs2kuMPQv4o"
};
