const express = require("express");
const app = express();
const router = express.Router();
const axios = require("axios");
require("dotenv").config();
const NodeCache = require("node-cache");
const myCache = new NodeCache();

const public_api_token = process.env.TOKEN;

/**
 * this will return an array containing all the
 * dates between startDate date and an endDate date
 */
const getDateArray = (startDate, endDate) => {
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
const prepareDateArray = (dateArr) => {
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
    return hoildayDates.indexOf(dt) < 0;
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

var weekEnds = (year) => {
  for(i = 0; i < 3; i++){
    var date = new Date(year, 0, i);
    var days = [];
    while (date.getFullYear() == year) {
            //  console.log(date)
      var m = date.getMonth() + 1;
      var d = date.getDate();
     days.push(
        year + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d)
      );
      date.setDate(date.getDate() + 7);
    }
  }      
   return days;
  }

weekEnds(2022);

/**
 * holidays and working weekendDates
 *
 * if not applicable then set it as an empty array
 * example: if no offical holidays then set
 * officalHolidays = []
 * similarly, if no working weekendDates then workingWeekendDates will be set to an empty array
 * workingWeekendDates = []
 */

router.get("/local_holidays/:start/:end/:regionCode", async (req, res) => {
  let startDateParam = req.params.start;
  let endDateParam = req.params.end;
  let region = req.params.regionCode;

  let startDate = new Date(`${startDateParam}`); //YYYY-MM-DD
  let endDate = new Date(`${endDateParam}`); //YYYY-MM-DD

  let dateArray = getDateArray(startDate, endDate);

  /**
  * 
  *  Hard coded the year 2021 to filter free weekend datees, 
    this was done due to the fact that the free versioned API been used permits only for previous year.
    On production the API it permits for any year, but a will be a paid version.
  * 
  * */
  workingWeekendDates = weekEnds(`2021`);

  // prepare the working weekendDates array
  let workingWeekendDatesArray = prepareDateArray(workingWeekendDates);

  let publicHoliday = [];
  axios
    .get("https://api.getfestivo.com/v2/holidays", {
      params: {
        api_key: `${public_api_token}`,
        country: `${region}`,
        year: 2021,
      },
    })
    .then((result) => {
      let data = result.data.holidays;
      for (let key of Object.keys(data)) {
        publicHoliday.push(data[key].date);
      }
      let holidaysArray = prepareDateArray(publicHoliday);
      let validWorkDaysArr = getWorkingDateArray(
        dateArray,
        holidaysArray,
        workingWeekendDatesArray
      );
      //  Formatting the date to the format YY-MM-DD
      let dates_arr = validWorkDaysArr.map((element) => {
        var d = new Date(element);
        return `${d.getFullYear()}-${d.getDate()}-${d.getMonth() + 1}`;
      });
      let freeDatesJSON = JSON.stringify(dates_arr);
      myCache.set("cachedResult", freeDatesJSON, 10000);
      return res.status(200).send(freeDatesJSON);
    })
    .catch((error) => {
      return res.status(501).send(error.message);
    })
    .then(() => {});
});

module.exports = router;
