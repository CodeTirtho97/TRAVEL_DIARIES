const express = require("express");
const router = express.Router();
const passport = require("passport");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");

router.get("/register", (req, res) => {
  res.render("users/register");
});

router.post(
  "/register",
  catchAsync(async (req, res, next) => {
    try {
      const { firstname, lastname, username, password } = req.body;
      const user = new User({ firstname, lastname, username });
      console.log(user);
      const registeredUser = await User.register(user, password);
      // res.send(registeredUser);
      req.login(registeredUser, (err) => {
        if (err) return next(err);
        req.flash("success", "Welcome to TRAVEL diaries!");
        res.redirect("/diaries");
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("register");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("users/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  (req, res) => {
    req.flash("success", "Welcome back!");
    let str = req.session.returnTo;
    if (str !== undefined) {
      const haveReview = str.includes("/reviews");
      if (haveReview) {
        const i = str.indexOf("/review");
        str = str.slice(0, i);
      }
      req.session.returnTo = str;
    }
    const redirectUrl = req.session.returnTo || "/diaries";
    delete req.session.returnTo;
    res.redirect(redirectUrl);
  }
);

router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "See You Again!");
  res.redirect("/diaries");
});

module.exports = router;
