const express = require('express')
const {
    createSchedule,
    getSchedules,
    getSchedule,
    deleteSchedule,
    updateSchedule
} = require('../controllers/scheduleController')

const router = express.Router()

// GET all workouts
router.get('/', getSchedules)

// GET a single workout 
router.get('/:id', getSchedule)

// POST  a new workout 
router.post('/new', createSchedule)

// DELETE a workout 
router.delete('/:id',deleteSchedule)

// UPDATE a workout
router.patch('/:id', updateSchedule)

module.exports = router