require('dotenv').config()

const express = require('express')
const workoutRoutes = require('./routes/workouts')
const { default: mongoose } = require('mongoose')

// express app
const ACLapp = express()


// middleware
ACLapp.use(express.json())


ACLapp.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

//routes
ACLapp.use('/api/workouts', workoutRoutes)


//connect to db
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        //listen for requests
        ACLapp.listen(process.env.PORT, () => {
            console.log('connected to db & listening on port ',process.env.PORT)
        })
    })
    .catch((error) => {
        console.log(error)
    })



