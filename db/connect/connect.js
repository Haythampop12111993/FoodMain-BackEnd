const mongoose = require("mongoose");
const config = require("config");
const db = config.get("mongoConnectionString");
console.log(db);
const connectDB = async () => {
  console.log("here");
  await mongoose.connect(db);
  console.log("MongoDB connected");
};
module.exports = connectDB;
