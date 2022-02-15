const express = require("express");
const router = express.Router({ mergeParams: true });
const { reviewSchema } = require("../JoiSchema");

const Diary = require("../models/diary");
const Review = require("../models/review");

const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.post(
  "/",
  validateReview,
  catchAsync(async (req, res) => {
    const diary = await Diary.findById(req.params.id);
    const review = new Review(req.body.review);
    diary.reviews.push(review);
    await review.save();
    await diary.save();
    req.flash("success", "Created New Review!");
    res.redirect(`/diaries/${diary._id}`);
  })
);

router.delete(
  "/:reviewId",
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Diary.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully Deleted Review");
    res.redirect(`/diaries/${id}`);
  })
);

module.exports = router;
