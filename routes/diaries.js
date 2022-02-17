const express = require("express");
const router = express.Router();
const moment = require("moment");
const catchAsync = require("../utils/catchAsync");
const { diarySchema } = require("../JoiSchema");
const { isLoggedIn } = require("../middleware");

const ExpressError = require("../utils/ExpressError");

const Diary = require("../models/diary");
const Like = require("../models/like");

const validateDiary = (req, res, next) => {
  const { error } = diarySchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.get(
  "/",
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
    });
  })
);

router.get(
  "/recent",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const recentDiaries = await Diary.find();
    recentDiaries.sort((a, b) => b.created - a.created);
    res.render("diaries/recent", { recentDiaries });
  })
);

router.get(
  "/mostliked",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const mostLikedDiaries = await Diary.find().populate("likes");
    mostLikedDiaries.sort((a, b) => b.likes.length - a.likes.length);
    res.render("diaries/mostliked", {
      mostLikedDiaries,
    });
  })
);

router.get("/new", isLoggedIn, (req, res) => {
  res.render("diaries/new");
});

router.post(
  "/",
  isLoggedIn,
  validateDiary,
  catchAsync(async (req, res) => {
    const diary = new Diary(req.body.diary);
    await diary.save();
    req.flash("success", "Successfully Added a new Diary");
    res.redirect(`/diaries/${diary._id}`);
  })
);

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const diary = await Diary.findById(req.params.id)
      .populate("reviews")
      .populate("likes");
    if (!diary) {
      req.flash("error", "Cannot find that Diary!");
      return res.redirect("/diaries");
    }
    const createdDate = moment(diary.created).calendar();
    const upDatedDate = moment(diary.updated).fromNow();
    res.render("diaries/show", {
      diary,
      createdDate,
      upDatedDate,
    });
  })
);

router.get(
  "/:id/edit",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const diary = await Diary.findById(req.params.id);
    res.render("diaries/edit", { diary });
  })
);

router.put(
  "/:id",
  isLoggedIn,
  validateDiary,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const diary = await Diary.findByIdAndUpdate(id, { ...req.body.diary });
    diary.updated = Date.now();
    await diary.save();
    req.flash("success", "Successfully Updated Diary!");
    res.redirect(`/diaries/${diary._id}`);
  })
);

router.delete(
  "/:id",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Diary.findByIdAndDelete(id);
    req.flash("success", "Successfully Deleted Diary!");
    res.redirect("/diaries");
  })
);

router.post(
  "/:id/likes",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const diary = await Diary.findById(req.params.id);
    const like = new Like(req.body.like);
    diary.likes.push(like);
    like.count++;
    await like.save();
    await diary.save();
    req.flash("success", "Successfully Liked Diary!");
    res.redirect(`/diaries/${diary._id}`);
  })
);

module.exports = router;
