const mongoose = require("mongoose");

const connectdb = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_URI);
    console.log(`DB connected - ${conn.connection.host}`);
  } catch (error) {
    console.log(`DB error - ${error.message}`);
  }
};

module.exports = connectdb;
