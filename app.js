const config = require("./utils/config");
const express = require("express");
const app = express();
const logger = require("./utils/logger");
const mongoose = require("mongoose");
const populateDb = require("./utils/populateDb");
const GasPrice = require("./models/gasPrice");
const middleware = require("./utils/middleware");
const axios = require("axios");
const { validationResult, query } = require("express-validator");

// Creates connection to the MongoDB database
logger.info("connecting to", config.MONGODB_URI);
mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connecting to MongoDB", error.message);
  });

// Function used to populate the MongoDB database with gas data
populateDb.populate();

// Returns JSON object containg the current fast, average, and low gas price
app.get("/gas", async (request, response) => {
  try {
    const currentGasPrice = await axios.get(
      `${config.ETHGASSTATION_URI}${config.ETHGASSTATION_API_KEY}`
    );

    /**
     * Creates the response object containing the fast, average, low gas prices and the block number
     * fast, average, and low are received as gwei * 10, so divide by 10 to get gwei
     */
    const currentGasPriceResponse = {
      error: "false",
      message: {
        fast: currentGasPrice.data.fastest / 10,
        average: currentGasPrice.data.fast / 10,
        low: currentGasPrice.data.safeLow / 10,
        blockNum: currentGasPrice.data.blockNum,
      },
    };

    /**
     * Checks for if any values in the response object are null/undefined/NaN
     * If true, returns an object containing an error message
     */
    for (const [key, value] of Object.entries(
      currentGasPriceResponse.message
    )) {
      if (value === undefined || value === null || value === NaN) {
        const errorResponse = {
          error: true,
          message: "fast, average, low, or blockNum were null",
        };
        return response.status(400).json(errorResponse);
      }
    }

    return response.status(200).json(currentGasPriceResponse);
  } catch (error) {
    // If the axios request fails, returns an object containing an error message
    const errorResponse = {
      error: true,
      message: error.message,
    };
    return response.status(400).json(errorResponse);
  }
});

/**
 * Returns JSON object containing the average gas price between the inputted range of time
 * Query Params are fromTime & toTime
 * Query Params should be in unix time
 */
app.get(
  "/average",
  [query("fromTime").notEmpty().isInt(), query("toTime").notEmpty().isInt()],
  (request, response) => {
    /**
     * Validate that the fromTime and toTime queries are present and that they are integer values
     * Returns an error message if validation fails
     */
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      const errorResponse = {
        error: true,
        message:
          "fromTime and toTime parameters must be integers and are required,",
      };
      return response.status(400).json(errorResponse);
    }

    // Grabs and stores the query parameters fromTime and toTime
    const fromTime = request.query.fromTime;
    const toTime = request.query.toTime;

    /**
     * Validate that the fromTime < toTime
     * Returns an error message if validation fails
     */
    if (fromTime > toTime) {
      const errorResponse = {
        error: true,
        message: "fromTime should be less than toTime,",
      };
      return response.status(400).json(errorResponse);
    }

    /**
     * Filters through MongoDB database for GasPrice objects
     * Filter is on unixTime field, where unixTime is >= fromTime and <= toTime
     * Returns a JSON objects containing an average gas price for that filter range
     * Returns an error if 0 matches were found for that time range
     */
    GasPrice.find({
      unixTime: {
        $gte: fromTime,
        $lte: toTime,
      },
    }).then((result) => {
      // If the result size is 0, that means no prices in that time frame were found, return an error
      if (result.length === 0) {
        const errorResponse = {
          error: true,
          message: "0 possible matches for that time range",
        };
        return response.status(400).json(errorResponse);
      }

      // Calculates the sum of fast, average, and low gas prices
      const gasPriceSums = result.reduce(
        (prevGasObj, currentGasObject) => {
          prevGasObj[0] += currentGasObject.fast;
          prevGasObj[1] += currentGasObject.average;
          prevGasObj[2] += currentGasObject.low;
          return prevGasObj;
        },
        [0, 0, 0] // fast, average, low
      );

      //Final return object which contains the average gas price for fast, average, and low as well as the time query params
      const averageGasPriceObj = {
        error: false,
        message: {
          averageFastGasPrice: gasPriceSums[0] / result.length,
          averageGasPrice: gasPriceSums[1] / result.length,
          averageLowGasPrice: gasPriceSums[2] / result.length,
          fromTime: fromTime,
          toTime: toTime,
        },
      };
      return response.status(200).json(averageGasPriceObj);
    });
  }
);

// Returns JSON object containing all gas prices in the database
app.get("/gasprices", (request, response) => {
  GasPrice.find({}).then((gasprices) => {
    response.status(200).json(gasprices);
  });
});

app.use(middleware.unknownEndpoint);

module.exports = app;
