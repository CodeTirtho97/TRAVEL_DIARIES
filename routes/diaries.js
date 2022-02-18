const express = require("express");
const router = express.Router();
const moment = require("moment");
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isAuthor, validateDiary } = require("../middleware");

const Diary = require("../models/diary");

router.get(
  "/",
  catchAsync(async (req, res) => {
    const recentDiaries = await Diary.find();
    const allDiaries = await Diary.find();

    recentDiaries.sort((a, b) => b.created - a.created);
    res.render("diaries/index", {
      recentDiaries,
      allDiaries,
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
  "/alldiaries",
  catchAsync(async (req, res) => {
    const allDiaries = await Diary.find();
    res.render("diaries/alldiaries", {
      allDiaries,
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
    diary.author = req.user._id;
    await diary.save();
    req.flash("success", "Successfully Added a new Diary");
    res.redirect(`/diaries/${diary._id}`);
  })
);

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const diary = await Diary.findById(req.params.id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("author");
    console.log(diary);
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
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const diary = await Diary.findById(id);
    if (!diary) {
      req.flash("error", "Cannot find that diary!");
      return res.redirect("/diaries");
    }
    res.render("diaries/edit", { diary });
  })
);

router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
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
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Diary.findByIdAndDelete(id);
    req.flash("success", "Successfully Deleted Diary!");
    res.redirect("/diaries");
  })
);

module.exports = router;
