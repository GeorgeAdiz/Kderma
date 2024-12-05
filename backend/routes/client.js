const express = require('express')
const {
    createClient,
    getClients,
    getClient,
    deleteClient,
    updateClient
} = require('../controllers/clientController')

const router = express.Router()

// GET all workouts
router.get('/', getClients)

// GET a single workout 
router.get('/:id', getClient)

// POST  a new workout 
router.post('/', createClient)

// DELETE a workout 
router.delete('/:id',deleteClient)

// UPDATE a workout
router.patch('/:id', updateClient)

module.exports = router