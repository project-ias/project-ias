require("dotenv").config();

module.exports = {
  MEILISEARCH_URL: "http://localhost:7700",
  // MEILISEARCH_URL: "https://search.project-ias.com",
  secretOrKey: "neera",
  // TODO : make this key environment variable later on.
  mainsSheetID: "1tdc3glFC8z9eJTIbkKvTk5cvvm-pvELGVnyfiqtClzQ",
  prelimsSheetID: "1aPa_Ru4vCF5uwV22RlbjwKhbII44xowcBO7LsxJ-rP0",
  sheetApi: "AIzaSyBiCZ0OfgSBTMUHwc4bpwCwKDPc3wGYTOY",
  // only viewer access via sheetApi
  slackApiUrl: process.env.SLACK_API_URL,
};
