const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const moment = require("moment");
const Diary = require("./models/diaries");

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

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/diaries", async (req, res) => {
  const diaries = await Diary.find();
  res.render("diaries/index", { diaries });
});

app.get("/diaries/new", (req, res) => {
  res.render("diaries/new");
});

app.post("/diaries", async (req, res) => {
  const diary = new Diary(req.body.diaries);
  await diary.save();
  res.redirect(`/diaries/${diary._id}`);
});

app.get("/diaries/:id", async (req, res) => {
  const diary = await Diary.findById(req.params.id);
  const date = moment(diary.updated).fromNow();
  res.render("diaries/show", { diary, date });
});

app.get("/diaries/:id/edit", async (req, res) => {
  const diary = await Diary.findById(req.params.id);
  res.render("diaries/edit", { diary });
});

app.put("/diaries/:id", async (req, res) => {
  const { id } = req.params;
  const diary = await Diary.findByIdAndUpdate(id, { ...req.body.diaries });
  res.redirect(`/diaries/${diary._id}`);
});

app.delete("/diaries/:id", async (req, res) => {
  const { id } = req.params;
  await Diary.findByIdAndDelete(id);
  res.redirect("/diaries");
});

app.listen(5000, () => {
  console.log("Serving on port 5000");
});
