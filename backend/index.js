const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { MeiliSearch } = require("meilisearch");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const passport = require("passport");
const fs = require("fs");

const supertokens = require("supertokens-node");
const Session = require("supertokens-node/recipe/session");
const ThirdPartyEmailPassword = require("supertokens-node/recipe/thirdpartyemailpassword");
const { Google } = ThirdPartyEmailPassword;

const { UserModel } = require("./models/models");
const keys = require("./config/keys");
const {
  BACKEND_URL,
  FRONTEND_URL,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_CLIENT_ID,
  SUPERTOKENS_URI,
  SUPERTOKENS_APIKEY,
} = require("./config/keys");
const premium = require("./apis/premium");
const manualMeilisearch = require("./apis/manual_meilisearch");
const cronjobs = require("./apis/run_cronjob");
const user = require("./apis/user");
const createAccountInMongo = require("./helpers/account_creator");
require("./config/passport")(passport);
require("dotenv").config();

//init mongodb. Ensure mongodb is installed in the machine. Terminal shows "mongo connected" when everything is alright.
const mongoDB = "mongodb://127.0.0.1/project_ias";
mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
const db = mongoose.connection;
db.on("open", () => console.log("mongo connected"));

//init meilisearch
const client = new MeiliSearch({
  host: keys.MEILISEARCH_URL,
  apiKey: "masterKey",
});

//init supertokens for user auth.
supertokens.init({
  supertokens: {
    connectionURI: SUPERTOKENS_URI,
    apiKey: SUPERTOKENS_APIKEY,
  },
  appInfo: {
    // learn more about this on https://supertokens.io/docs/thirdpartyemailpassword/appinfo
    appName: "Project IAS",
    apiDomain: BACKEND_URL,
    websiteDomain: FRONTEND_URL,
  },
  recipeList: [
    ThirdPartyEmailPassword.init({
      providers: [
        Google({
          clientSecret: GOOGLE_CLIENT_SECRET,
          clientId: GOOGLE_CLIENT_ID,
        }),
      ],
      override: {
        functions: (supertokensImpl) => {
          return {
            ...supertokensImpl,
            signIn: async (input) => {
              // we check if the email exists in SuperTokens. If not,
              // then the sign in should be handled by you.
              if (
                (await supertokensImpl.getUserByEmail({
                  email: input.email,
                })) === undefined
              ) {
                // TODO: sign in using your db
                const existUser = await UserModel.findOne({
                  email: input.email,
                }).exec();
                if (existUser === null) {
                  //user not found in our db too. let supertokens signin handle error.
                  return supertokensImpl.signIn(input);
                } else {
                  const validUser = bcrypt.compareSync(
                    input.password,
                    existUser.password
                  );
                  if (validUser) {
                    //create user in supertokens
                    return supertokensImpl.signUp(input);
                  } else {
                    //wrong password
                    return supertokensImpl.signIn(input);
                  }
                }
              } else {
                return supertokensImpl.signIn(input);
              }
            },
            signUp: async (input) => {
              // all new users are created in SuperTokens;
              createAccountInMongo(input.email);
              return supertokensImpl.signUp(input);
            },
            signInUp: async (input) => {
              //this function runs for thirdparty authentication like google OAuth
              createAccountInMongo(input.email.id);
              return supertokensImpl.signInUp(input);
            },
            getUserByEmail: async (input) => {
              let superTokensUser = await supertokensImpl.getUserByEmail(input);
              if (superTokensUser === undefined) {
                let email = input.email;
                // TODO: fetch and return user info from your database...
              } else {
                return superTokensUser;
              }
            },
            getUserById: async (input) => {
              let superTokensUser = await supertokensImpl.getUserById(input);
              if (superTokensUser === undefined) {
                let userId = input.userId;
                // TODO: fetch and return user info from your database...
              } else {
                return superTokensUser;
              }
            },
            getUserCount: async () => {
              let supertokensCount = await supertokensImpl.getUserCount();
              let yourUsersCount = 0; // TODO: fetch the count from your db
              return yourUsersCount + supertokensCount;
            },
          };
        },
      },
    }),
    Session.init(), // initializes session features
  ],
});

//setup cors and middleware.
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: FRONTEND_URL,
    allowedHeaders: ["content-type", ...supertokens.getAllCORSHeaders()],
    credentials: true,
  })
);
app.use(supertokens.middleware());
app.options("*", cors());
app.use(morgan("tiny"));
app.use(passport.initialize());

//testing route
app.get("/", (req, res) => {
  res.send("helo");
});

//api handled in specific routes. visit corresponding file.
app.use("/user", user);
app.use("/cronjobs", cronjobs);
app.use("/search", manualMeilisearch);
app.use("/premium", premium);

//keeps a log of queries searched in project-ias.
app.post("/log", async (req, res) => {
  const query_data = req.body.query_data;
  const id = crypto.randomBytes(20).toString("hex");
  query_data["id"] = id;
  const x = await client.index("query_logs").addDocuments([query_data]);
  res.send("Added");
});

//api for payment webhook. Razorpay
app.post("/payment", async (req, res) => {
  const today = new Date();
  const date = [today.getFullYear(), today.getMonth(), today.getDate()];
  try {
    const email = req.body.payload.payment.entity.notes.email;
    const status = req.body.event;
    const amount = req.body.payload.payment.entity.amount / 100;

    if (status !== "payment.captured") res.status(400).send("Payment failed.");
    else {
      UserModel.findOne({ email: email }, (err, docs) => {
        if (err) res.status(400).send(err);
        else if (docs === null) {
          //user not found in db.
          console.log("paid user email not found.");
          res.status(400).send("unknown email.");
        } else {
          var payDate = docs.payDate.split("-").map((i) => Number(i));
          const daysLeft =
            (payDate[0] - date[0]) * 365 +
            (payDate[1] - date[1]) * 30 +
            (payDate[2] - date[2]);

          //subscription still left. add subscription after expiry date.
          if (daysLeft > 0) {
            if (amount <= 50) {
              if (payDate[1] >= 12) {
                payDate[1] = (payDate[1] + 1) % 12;
                payDate[0] += 1;
              } else payDate[1] += 1;
            } else if (amount <= 250) {
              if (payDate[1] >= 7) {
                payDate[1] = (payDate[1] + 6) % 12;
                payDate[0] += 1;
              } else payDate[1] += 6;
            } else {
              payDate[0] += 1;
            }
          }

          //subscription over or not activated. start from present day.
          else {
            if (amount <= 50) {
              if (date[1] >= 12) {
                payDate[1] = (date[1] + 1) % 12;
                payDate[0] = date[0] + 1;
              } else payDate[1] = date[1] + 1;
            } else if (amount <= 250) {
              if (date[1] >= 7) {
                payDate[1] = (date[1] + 6) % 12;
                payDate[0] = date[0] + 1;
              } else payDate[1] = date[1] + 6;
            } else {
              payDate[0] = date[0] + 1;
            }
          }

          payDate = payDate.join("-");

          UserModel.findByIdAndUpdate(
            docs.id,
            { payDate: payDate },
            { new: true },
            (err, result) => {
              if (err) {
                console.log(err);
                res.status(400).send(err);
              } else {
                res.send("OK");
              }
            }
          );
        }
      });
    }
  } catch (err) {
    throw err;
  }
});

//supertokens error handler. part of their documentation.
app.use(supertokens.errorHandler());

const PORT = process.env.PORT || 5000;
app.listen(PORT);
console.log(`APP Started on ${PORT}`);

//updating existing users in mongoDB
//db.users.update({payDate: {$exists: false}},{$set: {payDate: "2021-9-18"}},{multi:true})
