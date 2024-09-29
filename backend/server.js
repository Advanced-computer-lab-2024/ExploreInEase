require('dotenv').config()

const express = require('express')
const workoutRoutes = require('./routes/workouts')

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


//listen for requests
ACLapp.listen(process.env.PORT, () => {
    console.log('listening on port ',process.env.PORT)
})

