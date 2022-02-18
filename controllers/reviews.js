const Diary = require("../models/diary");
const Review = require("../models/review");

module.exports.postReview = async (req, res) => {
  const diary = await Diary.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  diary.reviews.push(review);
  await review.save();
  await diary.save();
  req.flash("success", "Created New Review!");
  res.redirect(`/diaries/${diary._id}`);
};

module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Diary.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Successfully Deleted Review");
  res.redirect(`/diaries/${id}`);
};
