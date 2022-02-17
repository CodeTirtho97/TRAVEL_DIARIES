const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const likeSchema = new Schema({
  count: {
    type: Number,
    default: 0,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Like", likeSchema);
