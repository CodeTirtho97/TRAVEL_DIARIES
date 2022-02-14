const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const moment = require("moment");
const { diarySchema, reviewSchema } = require("./JoiSchema");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
const Diary = require("./models/diary");
const Review = require("./models/review");
const Like = require("./models/like");

mongoose.connect("mongodb://localhost:27017/travel-diaries", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

const validateDiary = (req, res, next) => {
  const { error } = diarySchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

app.get("/", (req, res) => {
  res.render("home");
});

app.get(
  "/diaries",
  catchAsync(async (req, res) => {
    const recentDiaries = await Diary.find();
    const mostLikedDiaries = await Diary.find().populate("likes");

    recentDiaries.sort((a, b) => b.created - a.created);
    // console.log(recentDiaries);
    mostLikedDiaries.sort((a, b) => b.likes.length - a.likes.length);
    // console.log(mostLikedDiaries);
    res.render("diaries/index", {
      recentDiaries,
      mostLikedDiaries,
      page_name: "home",
    });
  })
);

app.get(
  "/diaries/recent",
  catchAsync(async (req, res) => {
    const recentDiaries = await Diary.find();
    recentDiaries.sort((a, b) => b.created - a.created);
    res.render("diaries/recent", { recentDiaries, page_name: "recent" });
  })
);

app.get(
  "/diaries/mostliked",
  catchAsync(async (req, res) => {
    const mostLikedDiaries = await Diary.find().populate("likes");
    mostLikedDiaries.sort((a, b) => b.likes.length - a.likes.length);
    res.render("diaries/mostliked", {
      mostLikedDiaries,
      page_name: "mostliked",
    });
  })
);

app.get("/diaries/new", (req, res) => {
  res.render("diaries/new", { page_name: "new" });
});

app.post(
  "/diaries",
  validateDiary,
  catchAsync(async (req, res) => {
    const diary = new Diary(req.body.diary);
    console.log(diary);
    await diary.save();
    res.redirect(`/diaries/${diary._id}`);
  })
);

app.get(
  "/diaries/:id",
  catchAsync(async (req, res) => {
    const diary = await Diary.findById(req.params.id)
      .populate("reviews")
      .populate("likes");
    const createdDate = moment(diary.created).calendar();
    const upDatedDate = moment(diary.updated).fromNow();
    res.render("diaries/show", {
      diary,
      createdDate,
      upDatedDate,
      page_name: "diary",
    });
  })
);

app.get(
  "/diaries/:id/edit",
  catchAsync(async (req, res) => {
    const diary = await Diary.findById(req.params.id);
    res.render("diaries/edit", { diary });
  })
);

app.put(
  "/diaries/:id",
  validateDiary,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const diary = await Diary.findByIdAndUpdate(id, { ...req.body.diary });
    diary.updated = Date.now();
    await diary.save();
    res.redirect(`/diaries/${diary._id}`);
  })
);

app.delete(
  "/diaries/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Diary.findByIdAndDelete(id);
    res.redirect("/diaries");
  })
);

app.post(
  "/diaries/:id/reviews",
  validateReview,
  catchAsync(async (req, res) => {
    const diary = await Diary.findById(req.params.id);
    const review = new Review(req.body.review);
    diary.reviews.push(review);
    await review.save();
    await diary.save();
    res.redirect(`/diaries/${diary._id}`);
  })
);

app.delete(
  "/diaries/:id/reviews/:reviewId",
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Diary.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/diaries/${id}`);
  })
);

app.post(
  "/diaries/:id/likes",
  catchAsync(async (req, res) => {
    const diary = await Diary.findById(req.params.id);
    const like = new Like(req.body.like);
    diary.likes.push(like);
    like.count++;
    await like.save();
    await diary.save();
    res.redirect(`/diaries/${diary._id}`);
  })
);

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh No, Something Went Wrong!";
  res.status(statusCode).render("error", { err });
});

app.listen(5000, () => {
  console.log("Serving on port 5000");
});
