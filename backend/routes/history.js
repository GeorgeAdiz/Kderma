const express = require('express')
const {
    createHistory,
    getHistorys,
    getHistory,
    deleteHistory,
    updateHistory
} = require('../controllers/historyController')

const router = express.Router()

// GET all history
router.get('/', getHistorys)

// GET a single history 
router.get('/:id', getHistory)

// POST  a new history
router.post('/', createHistory)

// DELETE a history
router.delete('/:id',deleteHistory)

// UPDATE a history
router.patch('/:id', updateHistory)

module.exports = router