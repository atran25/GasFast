const axios = require("axios");
const GasPrice = require("../models/gasPrice");
const config = require("../utils/config");

/**
 * Function creates a new JSON object from the ethgasstation api and saves it into the MongoDB database
 */
const getCurrentGasPrice = async () => {
  const currentGasPrice = await axios.get(
    `${config.ETHGASSTATION_URI}${config.ETHGASSTATION_API_KEY}`
  );

  // fast, average, and low are received as gwei * 10, so divide by 10 to get gwei
  const gasPrice = new GasPrice({
    blockNum: currentGasPrice.data.blockNum,
    unixTime: Math.floor(Date.now() / 1000),
    fast: currentGasPrice.data.fastest / 10,
    average: currentGasPrice.data.fast / 10,
    low: currentGasPrice.data.safeLow / 10,
  });
  gasPrice.save();
};

// Function calls the function getCurrentGasPrice() every 5 seconds
const populate = () => {
  setInterval(() => {
    getCurrentGasPrice();
  }, 5000);
};

module.exports = { populate };
