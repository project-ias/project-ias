const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { MeiliSearch } = require("meilisearch");
const crypto = require("crypto");
const shell = require('shelljs')
const {returnMeiliSearchResults} = require('./meilisearch_results')
const bcrypt = require('bcryptjs');
const mongoose = require("mongoose");
const passport = require("passport");
const fs = require("fs");

const supertokens = require("supertokens-node");
const Session = require("supertokens-node/recipe/session");
const ThirdPartyEmailPassword = require("supertokens-node/recipe/thirdpartyemailpassword");
const {Google} = ThirdPartyEmailPassword;

const { UserModel } = require("./models/models");
const keys = require("./config/keys");
const { default: axios } = require("axios");
const { slackApiUrl, BACKEND_URL, FRONTEND_URL, GOOGLE_CLIENT_SECRET, GOOGLE_CLIENT_ID, SUPERTOKENS_URI, SUPERTOKENS_APIKEY } = require("./config/keys");
require("./config/passport")(passport);

const mongoDB = "mongodb://127.0.0.1/project_ias";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
const db = mongoose.connection;
db.on("open", () => console.log("mongo connected"));

require("dotenv").config();
const client = new MeiliSearch({
  host: keys.MEILISEARCH_URL,
  apiKey: "masterKey",
});

supertokens.init({
  supertokens: {
      connectionURI: SUPERTOKENS_URI,
      apiKey: SUPERTOKENS_APIKEY
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
                  clientId: GOOGLE_CLIENT_ID
              }),
          ],
          override: {
            functions: (supertokensImpl) => {
              return {
                ...supertokensImpl,
                signIn: async (input) => {
                   // we check if the email exists in SuperTokens. If not,
                   // then the sign in should be handled by you.
                   if (await supertokensImpl.getUserByEmail({ email: input.email }) === undefined) {
                      // TODO: sign in using your db
                      const existUser = await UserModel.findOne({email: input.email}).exec();
                      if(existUser === null) {
                        //user not found in our db too. let supertokens signin handle error.
                        return supertokensImpl.signIn(input);
                      }
                      else {
                        const validUser = bcrypt.compareSync(input.password, existUser.password);
                        if(validUser) {
                          //create user in supertokens
                          return supertokensImpl.signUp(input);
                        }
                        else {
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
                   const existUser = await UserModel.findOne({email: input.email}).exec();
                   if(existUser === null) {
                     //new user. create entry in mongodb
                    const salt = bcrypt.genSaltSync(10);
                    const hash = bcrypt.hashSync(input.password, salt);
                     let newUser = new UserModel({
                       email: input.email,
                       password: hash,
                       prelims: [],
                       mains: [],
                     });
                     await newUser.save(err => console.log(err));
                     //update on slack.
                     axios
                        .post(slackApiUrl, { text: `${input.email} just signed in` })
                        .then()
                        .catch((err) =>
                          console.log("Error while updating on slack : " + err)
                        );
                   }
                   return supertokensImpl.signUp(input);
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
                   let yourUsersCount = 0;// TODO: fetch the count from your db
                   return yourUsersCount + supertokensCount;
                }
              }
            }
          }
      }),
      Session.init() // initializes session features
  ]
});

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors({
  origin: FRONTEND_URL,
  allowedHeaders: ["content-type",  ...supertokens.getAllCORSHeaders() ],
  credentials: true, 
}));
app.use(supertokens.middleware());
app.options("*", cors());
app.use(morgan("tiny"));
app.use(passport.initialize());

app.get("/", (req, res) => {
  res.send("helo");
});

app.post(
  "/currentuser",
  (req, res) => {
    const email = req.body.email;
    UserModel.findOne({email: email}, (err, data) => {
      if(err) throw err;
      if(data === null) res.status(400).send("No user found");
      else {
        res.json({
          email: data.email,
          prelims: [...data.prelims],
          mains: [...data.mains],
          payDate: data.payDate,
        });
      }
    })
  }
);

app.post("/log", async (req, res) => {
  const query_data = req.body.query_data;
  const id = crypto.randomBytes(20).toString("hex");
  query_data["id"] = id;
  const x = await client.index("query_logs").addDocuments([query_data]);
  res.send("Added");
});

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

app.post("/search_pyq", async (req, res) => {
  const query = req.body.query;
  const results = await returnMeiliSearchResults("pyqs", query, 50);
  res.json(results);
});

app.post("/search_prelims", async (req, res) => {
  const query = req.body.query;
  const results = await returnMeiliSearchResults("prelims", query, 50);
  res.json(results);
});

app.post("/search_secure", async (req, res) => {
  const query = req.body.query;
  const results = await returnMeiliSearchResults("secure", query, 50);
  res.json(results);
});

app.post("/search_content", async (req, res) => {
  const query = req.body.query;
  const results = await returnMeiliSearchResults("content", query);
  res.json(results);
});

app.post("/search_wfv", async (req, res) => {
  const query = req.body.query;
  const results = await returnMeiliSearchResults("wfv", query, 50);
  res.json(results);
});

app.post("/search_vision", async (req, res) => {
  const query = req.body.query;
  const results = await returnMeiliSearchResults("vision", query, 50);
  res.json(results);
});

app.post("/search_dns", async (req, res) => {
  const query = req.body.query;
  const results = await returnMeiliSearchResults("dns", query, 5);
  res.json(results);
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

  UserModel.findOne({email: userEmail}, (err, docs) => {
    if (err) console.log(err);
    if(docs === null) res.status(400).send(err);
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

app.get("/topics", (req, res) => {
  try {
    const topicsJsonString = fs.readFileSync("./topics.json");
    const topicsJson = JSON.parse(topicsJsonString);
    res.json(topicsJson);
  } catch (err) {
    console.log(err);
    res.send("An error occured");
  }
});

app.post("/payment", (req,res) => {
  const today = new Date();
  const date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  try {
    const email = req.body.buyer;
    const status = req.body.status;

    if(status !== "Credit") res.status(400).send("Payment failed.");
    else {
      UserModel.findOne({email: email}, (err, docs) => {
        if(err) res.status(400).send(err);
        else if(docs === null) {
          //user not found in db.
          console.log("paid user email not found.");
          res.status(400).send("unknown email.");
        }
        else {
          UserModel.findByIdAndUpdate(docs.id, {payDate: date}, {new: true}, (err, result) => {
            if(err) {
              console.log(err);
              res.status(400).send(err);
            }
            else {
              res.send("OK");
            }
          })
        }
      })
    }
  }
  catch(err) {
    throw err;
  }
})

app.use(supertokens.errorHandler())

const PORT = process.env.PORT || 5000;
app.listen(PORT);
console.log(`APP Started on ${PORT}`);



//OLD API. FOR REFERENCE ONLY

// app.post("/signup", (req, res) => {
//   const { errors, isValid } = validateLoginInput(req.body);

//   // Check Validation
//   if (!isValid) {
//     return res.status(400).json(errors);
//   }

//   const email = req.body.email;
//   const password = req.body.password;

//   //hash password
//   const salt = bcrypt.genSaltSync(10);
//   const hash = bcrypt.hashSync(password, salt);

//   UserModel.find({ email: email }, (err, data) => {
//     if (err) {
//       return res.status(400).json(errors);
//     }

//     if (data.length) {
//       // if no matches, data is an empty array
//       errors.email = "Already have an account with this email";
//       return res.status(400).json(errors);
//     } else {
//       let newUser = new UserModel({
//         email: email,
//         password: hash,
//         prelims: [],
//         mains: [],
//       });
//       newUser
//         .save()
//         .then((item) => {
//           const payload = {
//             id: item.id,
//             email: item.email,
//             prelims: item.prelims,
//             mains: item.mains,
//           }; // Create JWT Payload
//           // Sign Token
//           jwt.sign(
//             payload,
//             keys.secretOrKey,
//             { expiresIn: 86400 },
//             (err, token) => {
//               return res.json({
//                 success: true,
//                 token: "Bearer " + token,
//               });
//             }
//           );
//           //update on slack.
//           // axios
//           //   .post(slackApiUrl, { text: `${item.email} just signed in` })
//           //   .then()
//           //   .catch((err) =>
//           //     console.log("Error while updating on slack : " + err)
//           //   );
//         })
//         .catch((err) => {
//           console.log("error in adding User ", err);
//           return res.status(500).send("Try again");
//         });
//     }
//   });
// });

// app.post("/signin", (req, res) => {
//   const { errors, isValid } = validateLoginInput(req.body);

//   // Check Validation
//   if (!isValid) {
//     return res.status(400).json(errors);
//   }

//   const email = req.body.email;
//   const password = req.body.password;

//   UserModel.findOne({ email: email }, (err, data) => {
//     if (err) {
//       return res.status(400).json(errors);
//     }
//     if (data !== null) {
//       // if no matches, data is an empty array
//       bcrypt.compare(password, data.password, (err, result) => {
//         if (err) return res.status(500).send("Try again");

//         if (result) {
//           const payload = {
//             id: data.id,
//             email: data.email,
//             prelims: data.prelims,
//             mains: data.mains,
//           }; // Create JWT Payload
//           // Sign Token
//           jwt.sign(
//             payload,
//             keys.secretOrKey,
//             { expiresIn: 86400 },
//             (err, token) => {
//               return res.json({
//                 success: true,
//                 token: "Bearer " + token,
//               });
//             }
//           );
//         } else {
//           errors.password = "Wrong Password";
//           return res.status(400).json(errors);
//         }
//       });
//     } else {
//       errors.email = "No existing account";
//       return res.status(400).json(errors);
//     }
//   });
// });

//updating existing users in mongoDB
//db.users.update({payDate: {$exists: false}},{$set: {payDate: "2021-9-18"}},{multi:true})