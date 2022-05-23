const express = require("express");
const app = express();
const router = express.Router();
const axios = require("axios");

/**
 * this will return an array containing all the
 * dates between start date and an end date
 */
var getDateArray =  (start, end) => {
  var arr = new Array();
  var dt = new Date(start);
  while (dt <= end) {
    arr.push(new Date(dt).toString().substring(0, 15)); //saving only to the format Day MMM DD YYYY part
    dt.setDate(dt.getDate() + 1);
  }
  return arr;
};


const weekEnds = (year) => {
  var date = new Date(year, 0, 1);
  while (date.getDay() != 0) {
    date.setDate(date.getDate() + 1);
  }
  var days = [];
  while (date.getFullYear() == year) {
    var m = date.getMonth() + 1;
    var d = date.getDate();
    days.push(
      year + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d)
    );
    date.setDate(date.getDate() + 7);
  }
  return days;
};

router.get("/country_list", async (req, res) => {
  try {
    const country_list = await axios.get(
      "https://date.nager.at/api/v3/AvailableCountries"
    );
    res.send(country_list.data);
  } catch (error) {
    console.log(error.message);
  }
});

router.get("/local_holidays", (req, res) => {
  res.send("Available local holidays based on country");
});

// Endpoint showing list of available times based on his country, from and to
router.get("/filtered_available_meeting_date", (req, res) => {
  res.send(
    "Available meeting dates based on end user country , set from and to date"
  );
});

module.exports = router;
