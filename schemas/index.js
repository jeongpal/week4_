// const mongoose = require("mongoose");

// const connect = () => {
//     mongoose
//       .connect("mongodb://54.180.144.125:27017/PRIVATE_PROJ")
//       .catch(err => console.log(err));
//   };
  
  
//   mongoose.connection.on("error", err => {
//     console.error("몽고디비 연결 에러", err);
//   });
require("dotenv").config();
  const mongoose = require("mongoose");
  // require("dotenv").config();
  // const DB_URL = process.env.DB_URL
  
  const connect = () => {
  mongoose.connect(process.env.DB_URL, { ignoreUndefined: true }).catch((err) => {
  console.error(err);
  });
  };

  module.exports = connect;