const express = require("express");
const fs = require("fs");
const validateCoupon = require("../helpers/coupon_validator");

const app = express.Router();

app.get("/subscriptionPlans", async (req, res) => {
  try {
    const payloadString = fs.readFileSync(
      __dirname + "/../cached_data/sub_rates.json"
    );
    res.json(JSON.parse(payloadString));
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

app.post("/coupon", async (req, res) => {
  const coupon = req.body.coupon;
  const payload = validateCoupon(coupon);
  if (payload === null) res.status(400).send("coupon not found");
  else res.json(payload);
});

module.exports = app;
