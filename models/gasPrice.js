const mongoose = require("mongoose");

const gasPriceSchema = new mongoose.Schema({
  blockNum: {
    type: Number,
    required: true,
  },
  unixTime: {
    type: Number,
    required: true,
  },
  fast: {
    type: Number,
    required: true,
  },
  average: {
    type: Number,
    required: true,
  },
  low: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("GasPrice", gasPriceSchema);
