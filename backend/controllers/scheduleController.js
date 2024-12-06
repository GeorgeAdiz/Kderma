const Schedule = require('../models/schedulemodel')
const mongoose = require('mongoose')

// get all schedules
const getSchedules = async (req, res) => {
    const schedules = await Schedule.find({}).sort({createdAt: -1})

    res.status(200).json(schedules)
}

// get a single schedules
const getSchedule = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such schedule'}) 
    }

    const schedule = await Schedule.findById(id)

    if (!schedule) {
        return res.status(404).json({error: 'No such schedule'})
    }

    res.status(200).json(schedule)
}

// create new schedules
const createSchedule = async (req, res) => {
    const {clientID, clientName, aesthetician, treatment, date, time} = req.body

    // add doc to db
    try{
        const schedule = await Schedule.create({clientID, clientName, aesthetician, treatment, date, time})
        res.status(200).json(schedule)
    } catch (error){
        res.status(400).json({error: error.message})
    }
}

// delete schedule
const deleteSchedule = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such schedule'}) 
    }

    const schedule = await Schedule.findOneAndDelete({_id: id})

    if (!schedule) {
        return res.status(400).json({error: 'No such schedule'})
    }

    res.status(200).json(schedule)
}

// update a schedule
const updateSchedule = async (req, res) =>{
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such schedule'}) 
    }

    const schedule = await Schedule.findOneAndUpdate({_id: id}, {
        ...req.body
    })

    if (!schedule) {
        return res.status(400).json({error: 'No such schedule'})
    }

    res.status(200).json(schedule)
}

module.exports = {
    getSchedules,
    getSchedule,
    createSchedule,
    deleteSchedule,
    updateSchedule
}