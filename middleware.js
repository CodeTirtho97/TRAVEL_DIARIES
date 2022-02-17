const { diarySchema, reviewSchema } = require("./JoiSchema");
const ExpressError = require("./utils/ExpressError");
const Diary = require("./models/diary");
const Review = require("./models/review");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "Please Sign In");
    return res.redirect("/login");
  }
  next();
};

module.exports.validateDiary = (req, res, next) => {
  const { error } = diarySchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const diary = await Diary.findById(id);
  if (!diary.author.equals(req.user._id)) {
    req.flash("error", "You are not allowed to do that!");
    return res.redirect(`/diaries/${id}`);
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that!");
    return res.redirect(`/diaries/${id}`);
  }
  next();
};

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
