require('dotenv').config()

const express = require('express')


// express app
const ACLapp = express()

//routes
express.application.get('/', (req, res) => {
    res.json ({mssg: 'welcome to the app'})
})

//listen for requests
express.application.listen(process.env.PORT, () => {
    console.log('listening on port ',process.env.PORT)
})

