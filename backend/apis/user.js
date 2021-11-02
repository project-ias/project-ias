const express = require("express");
const { UserModel } = require("../models/models");
const app = express.Router();
const fs = require("fs");

app.get("/topics", (req, res) => {
  try {
    const topicsJsonString = fs.readFileSync("scripts/topics.json");
    const topicsJson = JSON.parse(topicsJsonString);
    res.json(topicsJson);
  } catch (err) {
    console.log(err);
    res.send("An error occured");
  }
});

app.post("/currentuser", (req, res) => {
  const email = req.body.email;
  UserModel.findOne({ email: email }, (err, data) => {
    if (err) throw err;
    if (data === null) res.status(400).send("No user found");
    else {
      res.json({
        email: data.email,
        prelims: [...data.prelims],
        mains: [...data.mains],
        payDate: data.payDate,
      });
    }
  });
});

app.post("/user_mains", async (req, res) => {
  const userEmail = req.body.userEmail;
  const questionID = req.body.questionID;
  const isSolved = req.body.isSolved;
  const hasRevised = req.body.hasRevised;
  const today = new Date();
  const date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  const userQuestionObject = {
    questionID: questionID,
    date: date,
    hasRevised: hasRevised,
  };

  UserModel.findOne({ email: userEmail }, (err, docs) => {
    if (err) console.log(err);
    if (docs === null) res.status(400).send(err);
    else {
      var userQuestions = [...docs.mains];
      userQuestions = userQuestions.filter(
        (value, index, arr) => value.questionID !== questionID
      );
      if (isSolved) {
        userQuestions.push(userQuestionObject);
      }
      UserModel.findByIdAndUpdate(
        docs.id,
        { mains: userQuestions },
        { new: true },
        (err, result) => {
          if (err) res.status(400).send(err);
          else {
            res.send(result);
          }
        }
      );
    }
  });
});

module.exports = app;
