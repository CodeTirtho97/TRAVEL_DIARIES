const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const diariesSchema = new Schema({
  title: String,
  image: String,
  cost: Number,
  description: String,
  location: String,
  created: {
    type: Date,
    default: Date.now,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: "Like",
    },
  ],
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

diariesSchema.pre("save", function (next) {
  const now = this;
  now.updated = Date.now();
  if (!this.created) {
    this.created = now;
  }
  next();
});

diariesSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

module.exports = mongoose.model("Diary", diariesSchema);
