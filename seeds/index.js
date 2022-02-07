const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Diaries = require("../models/diaries");

mongoose.connect("mongodb://localhost:27017/travel-diaries", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const test = (arr) => arr[Math.floor(Math.random() * arr.length)];

const seedDB = async () => {
  await Diaries.deleteMany({});
  for (let i = 0; i < 20; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const diary = new Diaries({
      title: `${test(descriptors)} ${test(places)}`,
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
    });
    await diary.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
