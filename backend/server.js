require('dotenv').config()

const express = require('express')


// express app
const ACLapp = express()


// middleware
ACLapp.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

//routes
ACLapp.get('/', (req, res) => {
    res.json ({mssg: 'welcome to the app'})
})

//listen for requests
ACLapp.listen(process.env.PORT, () => {
    console.log('listening on port ',process.env.PORT)
})

