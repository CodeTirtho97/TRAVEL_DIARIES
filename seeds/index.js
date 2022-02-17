const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Diaries = require("../models/diary");

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
    const cost = Math.floor(Math.random() * 90 + 10) * 100;
    const diary = new Diaries({
      author: "620e2c6891adb3a9117b5f5b",
      title: `${test(descriptors)} ${test(places)}`,
      image: "https://source.unsplash.com/random/600x400?india",
      cost,
      description:
        "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ipsa quibusdam consectetur ab! Saepe sit optio illo, eum at reiciendis necessitatibus ipsum quis? Magni optio natus doloremque assumenda a eos ab nostrum distinctio, vitae, ullam soluta ut similique harum blanditiis eaque inventore. Fugiat ullam minima eveniet quam sint, nisi sapiente dolorum.",
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
    });
    await diary.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
