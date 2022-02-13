const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const likeSchema = new Schema({
  count: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Like", likeSchema);
