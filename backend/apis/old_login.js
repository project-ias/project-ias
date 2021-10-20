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