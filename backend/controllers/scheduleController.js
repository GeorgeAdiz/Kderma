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
const updateSchedule = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such schedule'}); 
    }

    try {
        // First, get the existing schedule
        const existingSchedule = await Schedule.findById(id);
        
        if (!existingSchedule) {
            return res.status(404).json({error: 'No such schedule'});
        }

        // If clientID hasn't changed, we can update
        // If it has changed, we need to check if the new ID exists
        if (req.body.clientID !== existingSchedule.clientID) {
            // Check if the new clientID already exists in other documents
            const duplicateCheck = await Schedule.findOne({
                clientID: req.body.clientID,
                _id: { $ne: id } // Exclude current document
            });

            if (duplicateCheck) {
                return res.status(400).json({
                    error: 'This Client ID is already in use'
                });
            }
        }

        // If we get here, it's safe to update
        const schedule = await Schedule.findOneAndUpdate(
            { _id: id },
            { ...req.body },
            { new: true } // Return the updated document
        );

        res.status(200).json(schedule);
    } catch (error) {
        console.error('Update error:', error);
        res.status(400).json({
            error: error.code === 11000 
                ? 'This Client ID is already in use'
                : 'Error updating schedule'
        });
    }
};

module.exports = {
    getSchedules,
    getSchedule,
    createSchedule,
    deleteSchedule,
    updateSchedule
}