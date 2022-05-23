const express = require("express");
const app = express();
const router = express.Router();
const axios = require("axios");

/**
 * this will return an array containing all the
 * dates between startDate date and an endDate date
 */
let getDateArray =  (startDate, endDate) => {
  let arr = new Array();
  let dt = new Date(startDate);
  while (dt <= endDate) {
    arr.push(new Date(dt).toString().substring(0, 15)); //saving only to the format Day MMM DD YYYY part
    dt.setDate(dt.getDate() + 1);
  }
  return arr;
};


/**
 * this will return an array consisting of the
 * working dates
 */
 let getWorkingDateArray = (dates, hoildayDates, workingWeekendDates) => {
  // remove holidays
  let arr = dates.filter((dt) => {
    return holidaysArray.indexOf(dt) < 0;
  });

  // remove weekendDate dates that are not working dates
  let result = arr.filter((dt) => {
    if (dt.indexOf("Sat") > -1 || dt.indexOf("Sun") > -1) {
      if (workingWeekendDates.indexOf(dt) > -1) {
        return dt;
      }
    } else {
      return dt;
    }
  });

  return result;
};



// const weekendDates = (year) => {
//   let date = new Date(year, 0, 1);
//   while (date.getDay() != 0) {
//     date.setDate(date.getDate() + 1);
//   }
//   let days = [];
//   while (date.getFullYear() == year) {
//     let m = date.getMonth() + 1;
//     let d = date.getDate();
//     days.push(
//       year + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d)
//     );
//     date.setDate(date.getDate() + 7);
//   }
//   return days;
// };

router.get("/country_list", async (req, res) => {
  try {
    const country_list = await axios.get(
      "https://date.nager.at/api/v3/AvailableCountries"
    );
    console.log(country_list)
    res.sendDate(country_list.data);
  } catch (error) {
    console.log(error.message);
  }
});

router.get("/local_holidays", async(req, res) => {
  try {
    const country_list = await axios.get(
      "https://support.google.com/business/answer/6333474?hl=en#region_ad"
    );
    res.sendDate(country_list.data);
  } catch (error) {
    console.log(error.message);
  }
  res.sendDate("Available local holidays based on country");
});

// endDatepoint showing list of available times based on his country, from and to
router.get("/filtered_available_meeting_date", (req, res) => {
  res.sendDate(
    "Available meeting dates based on endDate user country , set from and to date"
  );
});

module.exports = router;
