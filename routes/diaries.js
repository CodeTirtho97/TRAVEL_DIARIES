const express = require("express");
const router = express.Router();
const diaries = require("../controllers/diaries");
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isAuthor, validateDiary } = require("../middleware");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

router
  .route("/")
  .get(catchAsync(diaries.index))
  .post(
    isLoggedIn,
    upload.array("images", 4),
    validateDiary,
    catchAsync(diaries.createDiary)
  );
// .post(upload.array("images", 4), (req, res) => {
//   console.log(req.body, req.files);
//   res.send("It worked");
// });

router.get("/recent", isLoggedIn, catchAsync(diaries.recent));

router.get("/alldiaries", catchAsync(diaries.alldiaries));

router.get("/new", isLoggedIn, diaries.renderNewForm);

router
  .route("/:id")
  .get(catchAsync(diaries.showDiary))
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("images", 4),
    validateDiary,
    catchAsync(diaries.updateDiary)
  )
  .delete(isLoggedIn, isAuthor, catchAsync(diaries.deleteDiary));

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(diaries.renderEditForm)
);

module.exports = router;
