const User = require("../models/user");

module.exports.renderRegister = (req, res) => {
  res.render("users/register");
};

module.exports.register = async (req, res, next) => {
  try {
    const { firstname, lastname, username, password } = req.body;
    const user = new User({ firstname, lastname, username });
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
};

module.exports.renderLogin = (req, res) => {
  res.render("users/login");
};

module.exports.login = (req, res) => {
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
};

module.exports.logout = (req, res) => {
  req.logout();
  req.flash("success", "See You Again!");
  res.redirect("/diaries");
};
