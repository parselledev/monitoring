const mongoose = require('mongoose');

const mongoDB_url = process.env.DATABASE_URL;

const connectDB = async () => {
  try {
    mongoose.connect(mongoDB_url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (err) {}
};
module.exports = connectDB;
