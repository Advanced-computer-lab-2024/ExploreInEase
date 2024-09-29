const express = require('express')

const router = express.Router()


// GET all workouts
router.get('/', (req, res) => {
    res.json({mssg: 'Get all workouts'})
})

//GET A SINGLE WORKOUT
router.get('/:id', (req, res) => {
    res.json({mssg: 'Get a single workout'})
})

//POST a new workout
router.post ('/', (req, res) => {
    res.json({mssg: 'POST a new workout'})
})

//DELETE a workout
router.delete ('/:id', (req, res) => {
    res.json({mssg: 'DELETE a workout'})
})

//UPDATE  workout
router.patch ('/:id', (req, res) => {
    res.json({mssg: 'update a new workout'})
})

module.exports = router