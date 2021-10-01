const shell = require("shelljs");
const express = require("express");
const app = express.Router();

app.get("/cron_dhristi", (req, res) => {
  res.send("Will Start Cronjob to fetch Dhristi Content");
  try {
    shell.exec("bash add_today_dhristi.sh");
  } catch (err) {
    console.log("Error in running bash", err);
  }
});

app.get("/cron_dns", (req, res) => {
  res.send("Will Start Cronjob to fetch Rau DNS");
  try {
    shell.exec("bash add_today_dns.sh");
  } catch (err) {
    console.log("Error in running bash", err);
  }
});

app.get("/cron_gsheet", (req, res) => {
  res.send("Will Start Cronjob to sync Google Sheet changes");
  try {
    shell.exec("bash update_gsheets.sh");
  } catch (err) {
    console.log("Error in running bash", err);
  }
});

module.exports = app;
