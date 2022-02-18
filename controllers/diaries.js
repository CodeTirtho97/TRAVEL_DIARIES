const Diary = require("../models/diary");
const moment = require("moment");
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
  const recentDiaries = await Diary.find();
  const allDiaries = await Diary.find();

  recentDiaries.sort((a, b) => b.created - a.created);
  res.render("diaries/index", {
    recentDiaries,
    allDiaries,
  });
};

module.exports.recent = async (req, res) => {
  const recentDiaries = await Diary.find();
  recentDiaries.sort((a, b) => b.created - a.created);
  res.render("diaries/recent", { recentDiaries });
};

module.exports.alldiaries = async (req, res) => {
  const allDiaries = await Diary.find();
  res.render("diaries/alldiaries", {
    allDiaries,
  });
};

module.exports.renderNewForm = (req, res) => {
  res.render("diaries/new");
};

module.exports.createDiary = async (req, res) => {
  const diary = new Diary(req.body.diary);
  diary.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  diary.author = req.user._id;
  await diary.save();
  console.log(diary);
  req.flash("success", "Successfully Added a new Diary");
  res.redirect(`/diaries/${diary._id}`);
};

module.exports.showDiary = async (req, res) => {
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
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const diary = await Diary.findById(id);
  if (!diary) {
    req.flash("error", "Cannot find that diary!");
    return res.redirect("/diaries");
  }
  res.render("diaries/edit", { diary });
};

module.exports.updateDiary = async (req, res) => {
  const { id } = req.params;
  const diary = await Diary.findByIdAndUpdate(id, { ...req.body.diary });
  const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  diary.images.push(...imgs);
  diary.updated = Date.now();
  await diary.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await campground.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }
  req.flash("success", "Successfully Updated Diary!");
  res.redirect(`/diaries/${diary._id}`);
};

module.exports.deleteDiary = async (req, res) => {
  const { id } = req.params;
  await Diary.findByIdAndDelete(id);
  req.flash("success", "Successfully Deleted Diary!");
  res.redirect("/diaries");
};
