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