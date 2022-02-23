if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const mongoose = require("mongoose");
const cities = require("./citiesGeo");
const { places, descriptors } = require("./seedHelpers");
const Diaries = require("../models/diary");

const dbUrl = process.env.DB_URL;

mongoose.connect(dbUrl, {
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
  for (let i = 0; i < 5; i++) {
    const random100 = Math.floor(Math.random() * 100);
    const cost = Math.floor(Math.random() * 90 + 10) * 100;
    const diary = new Diaries({
      author: "62169176f94bf2e2e80c8631",
      title: `${test(descriptors)} ${test(places)}`,
      location: `${cities[random100].city}, ${cities[random100].state}`,
      geometry: {
        type: "Point",
        coordinates: [
          Number(`${cities[random100].longitude}`),
          Number(`${cities[random100].latitude}`),
        ],
      },
      images: [
        {
          url: "https://res.cloudinary.com/tirthoyelpcamp/image/upload/v1645221214/TravelDiaries/r37b5rgy8qgei4qsv2ep.jpg",
          filename: "TravelDiaries/r37b5rgy8qgei4qsv2ep",
        },
        {
          url: "https://res.cloudinary.com/tirthoyelpcamp/image/upload/v1645221214/TravelDiaries/ywgmlzjzv5zb2uhyyr2a.jpg",
          filename: "TravelDiaries/ywgmlzjzv5zb2uhyyr2a",
        },
      ],
      cost,
      description:
        "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ipsa quibusdam consectetur ab! Saepe sit optio illo, eum at reiciendis necessitatibus ipsum quis? Magni optio natus doloremque assumenda a eos ab nostrum distinctio, vitae, ullam soluta ut similique harum blanditiis eaque inventore. Fugiat ullam minima eveniet quam sint, nisi sapiente dolorum.",
    });
    await diary.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
