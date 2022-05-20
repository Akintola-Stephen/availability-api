const express = require('express')
const app = express()
const router = express.Router()



router.get('/country_list', (req,res)=>{
    res.send('List of available countries')
})


router.get('/local_holidays', (req,res)=>{
    res.send('Available local holidays based on country')
})


// Endpoint showing list of available times based on his country, from and to 
router.get('/filtered_available_meeting_date', (req,res)=>{
    res.send('Available meeting dates based on end user country , set from and to date')
})


module.exports = router

