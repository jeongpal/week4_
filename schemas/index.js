const mongoose = require("mongoose");

const connect = () => {
    mongoose
      .connect("mongodb://54.180.81.39/:27017/PRIVATE_PROJ")
      .catch(err => console.log(err));
  };
  
  
  mongoose.connection.on("error", err => {
    console.error("몽고디비 연결 에러", err);
  });
  
  module.exports = connect;