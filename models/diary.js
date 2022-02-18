const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const diarySchema = new Schema({
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
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

diarySchema.pre("save", function (next) {
  const now = this;
  now.updated = Date.now();
  if (!this.created) {
    this.created = now;
  }
  next();
});

diarySchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

module.exports = mongoose.model("Diary", diarySchema);
