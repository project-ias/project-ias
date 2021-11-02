const { default: axios } = require("axios");
const fs = require("fs");
const { subscriptionSheetID } = require("../config/keys");
const gsheetURL = require("./gsheetURL");
require("dotenv").config();

const cacheSubscriptionRates = async () => {
  const { data } = await axios.get(
    gsheetURL(subscriptionSheetID, "Subscription Plans")
  );
  const dataArr = data.values;
  const rateObjArr = [];
  for (var i = 1; i < dataArr.length; i++) {
    const rateObj = {
      tenure: dataArr[i][0],
      fee: dataArr[i][1],
      link: dataArr[i][2],
    };
    rateObjArr.push(rateObj);
  }
  fs.writeFile(
    __dirname + "/../cached_data/sub_rates.json",
    JSON.stringify(rateObjArr),
    (err) => {
      if (err) console.log(err);
    }
  );
};

const cacheSubscriptionCoupons = async () => {
  const { data } = await axios.get(
    gsheetURL(subscriptionSheetID, "Referral Codes")
  );
  const dataArr = data.values;
  const couponObjArr = [];
  for (var i = 1; i < dataArr.length; i++) {
    const couponObj = {
      code: dataArr[i][0],
      link: dataArr[i][1],
      tenure: dataArr[i][2],
      promoter: dataArr[i][3],
    };
    couponObjArr.push(couponObj);
  }
  fs.writeFile(
    __dirname + "/../cached_data/sub_coupons.json",
    JSON.stringify(couponObjArr),
    (err) => {
      if (err) console.log(err);
    }
  );
};

const fetchSubscriptionDataFromGsheet = async () => {
  cacheSubscriptionRates();
  cacheSubscriptionCoupons();
};

fetchSubscriptionDataFromGsheet();
