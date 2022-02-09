const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const diariesSchema = new Schema({
  title: String,
  image: String,
  cost: Number,
  description: String,
  location: String,
  updated: {
    type: Date,
    default: Date.now,
  },
});

diariesSchema.pre("save", function (next) {
  const now = this;
  now.updated = Date.now();
  next();
});

module.exports = mongoose.model("Diaries", diariesSchema);
