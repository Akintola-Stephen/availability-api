# availability-api
Schedules meeting time based on end user availability, excluding weekends and public holidays


## Tech Stack

- [Nodejs](https://nodejs.org/en/)
- [Express.js](https://expressjs.com/) - Nodejs framework
- [node-cache](https://www.npmjs.com/package/node-cache) - For caching

## API endpoint

- User Registration http://localhost:3000/local_holiday/${startDate}/${endDate}/${regionCode}


## API Usage

A third party libraRY API was used which performs functionalities of:
- [Festivo](https://api.getfestivo.com/v2/holidays) Returns the list of public holidays based on a country region
    ## API USAGE
    - API accepts country, year and token key as its parameter (Therefore a token key needs to be generated via the website (https://app.getfestivo.com/) )

## Business Logic
1. getDateArray Function 
    *  This will return an array containing all the dates between startDate date and an endDate date (It accepts two parameters (start date and end date))
2. prepareDateArray Function
    *   this will prepare a date array and formats it to the format YY-MM-DD
3. getWorkingDateArray
    *   Returns an array consisting of all valid working dates
4. weekEnds
*   Returns every weekend dates (Saturday and Sundays Only)

## Account Funding

The amount is captured when a user wants to fund their account

# Validations
## Instructions to running the application
1. git clone from the repo "https://github.com/Akintola-Stephen/availability-api.git".
2. Change to the directory with the command cd "availability-api"
3. Create a .env file then create a TOKEN variable with  a passed token value generated from getfestivo (Register on (https://api.getfestivo.com) then generate your token key)
4. install dependecies with command "npm i"
5. Run the application with the command "nodemon app.js" or "node app.js"
5. Access the application endpoint (http://localhost:3000/local_holiday/${startDate}/${endDate}/${regionCode}), e.g "http://localhost:3000/local_holidays/2021/2021-05-30/NG"
