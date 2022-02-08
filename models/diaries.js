const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const diariesSchema = new Schema({
  title: String,
  image: String,
  cost: Number,
  description: String,
  location: String,
});

module.exports = mongoose.model("Diaries", diariesSchema);
