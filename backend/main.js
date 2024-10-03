require('dotenv').config()

const express = require('express')
const router = express.Router()

// const userRoutes = require('./src/components/users/userRoutes')
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
// ACLapp.use('/users/createTourist', userRoutes)


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

const userRepository = require('./src/components/users/userRepository')

router.get('/fetchAllUsers',userRepository.fetchAllUsers);

