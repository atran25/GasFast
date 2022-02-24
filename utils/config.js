require("dotenv").config();

const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;
const ETHGASSTATION_URI = process.env.ETHGASSTATION_URI;
const ETHGASSTATION_API_KEY = process.env.ETHGASSTATION_API_KEY;

module.exports = {
  MONGODB_URI,
  PORT,
  ETHGASSTATION_URI,
  ETHGASSTATION_API_KEY,
};
