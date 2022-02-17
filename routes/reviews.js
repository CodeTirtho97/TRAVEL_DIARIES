const express = require("express");
const router = express.Router({ mergeParams: true });

const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");

const Diary = require("../models/diary");
const Review = require("../models/review");

const catchAsync = require("../utils/catchAsync");

router.post(
  "/",
  isLoggedIn,
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
  isLoggedIn,
  isReviewAuthor,
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Diary.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully Deleted Review");
    res.redirect(`/diaries/${id}`);
  })
);

module.exports = router;
