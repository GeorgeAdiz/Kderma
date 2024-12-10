const History = require('../models/historymodel')
const mongoose = require('mongoose')

// get all historys
const getHistorys = async (req, res) => {
    const historys = await History.find({}).sort({createdAt: -1})

    res.status(200).json(historys)
}

// get a single history
const getHistory = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such history'}) 
    }

    const history = await History.findById(id)

    if (!history) {
        return res.status(404).json({error: 'No such history'})
    }

    res.status(200).json(history)
}

// create new history
const createHistory = async (req, res) => {
    const {name, treatment, aesthetician, dateAdded} = req.body

    // add doc to db
    try{
        const history = await History.create({name, treatment, aesthetician, dateAdded})
        res.status(200).json(history)
    } catch (error){
        res.status(400).json({error: error.message})
    }
}

// delete history
const deleteHistory = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such history'}) 
    }

    const history = await History.findOneAndDelete({_id: id})

    if (!history) {
        return res.status(400).json({error: 'No such history'})
    }

    res.status(200).json(history)
}

// update a history
const updateHistory = async (req, res) =>{
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such history'}) 
    }

    const history = await History.findOneAndUpdate({_id: id}, {
        ...req.body
    })

    if (!history) {
        return res.status(400).json({error: 'No such history'})
    }

    res.status(200).json(history)
}

module.exports = {
    getHistorys,
    getHistory,
    createHistory,
    deleteHistory,
    updateHistory
}