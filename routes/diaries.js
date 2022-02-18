const express = require("express");
const router = express.Router();
const diaries = require("../controllers/diaries");
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isAuthor, validateDiary } = require("../middleware");

router
  .route("/")
  .get(catchAsync(diaries.index))
  .post(isLoggedIn, validateDiary, catchAsync(diaries.createDiary));

router.get("/recent", isLoggedIn, catchAsync(diaries.recent));

router.get("/alldiaries", catchAsync(diaries.alldiaries));

router.get("/new", isLoggedIn, diaries.renderNewForm);

router
  .route("/:id")
  .get(catchAsync(diaries.showDiary))
  .put(isLoggedIn, isAuthor, validateDiary, catchAsync(diaries.updateDiary))
  .delete(isLoggedIn, isAuthor, catchAsync(diaries.deleteDiary));

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(diaries.renderEditForm)
);

module.exports = router;
