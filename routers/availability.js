const express = require("express");
const app = express();
const router = express.Router();
const axios = require("axios");
require('dotenv').config()


const public_api_token_key = process.env.TOKEN


/**
 * this will return an array containing all the
 * dates between startDate date and an endDate date
 */
let getDateArray = (startDate, endDate) => {
  let arr = new Array();
  let dt = new Date(startDate);
  while (dt <= endDate) {
    arr.push(new Date(dt).toString().substring(0, 15)); //saving only to the format Day MMM DD YYYY part
    dt.setDate(dt.getDate() + 1);
  }
  return arr;
};

/**
 * this will prepare a date array
 */
let prepareDateArray = (dateArr) => {
  let arr = new Array();
  for (let i = 0; i < dateArr.length; i++) {
    arr.push(new Date(dateArr[i]).toString().substring(0, 15)); //save only the Day MMM DD YYYY part
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



router.get("/local_holidays", async (req, res) => {
  let publicHoliday = []
  axios
    .get("https://api.getfestivo.com/v2/holidays", {
      params: {
        api_key: `${public_api_token_key}`,
        country: "NG",
        year: 2021,
      },
    })
    .then((res) => {
      let data = res.data.holidays
      // Object.keys(())
      for(let key of Object.keys(data)){
        publicHoliday.push(data[key].data)
        console.log(data[key].date);
      }
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .then(function () {
      // always executed
    });
});

// endDatepoint showing list of available times based on his country, from and to
router.get("/filtered_available_meeting_date", (req, res) => {
  res.sendDate(
    "Available meeting dates based on endDate user country , set from and to date"
  );
});

module.exports = router;
