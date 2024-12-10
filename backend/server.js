require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const clientRoutes = require('./routes/client')
const scheduleRoutes = require('./routes/schedule')
const historyRoutes = require('./routes/history')

// express app 
const app = express()
const cors = require('cors')

// middleware
app.use(express.json())
app.use(cors())

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

// routes
app.use('/api/client',clientRoutes)
app.use('/api/schedule',scheduleRoutes)
app.use('/api/history',historyRoutes)

// connect to db
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        // listen for requests
        app.listen(process.env.PORT, () => {
            console.log('connected to db & listening on port', process.env.PORT)
})

    })
    .catch((error) => {
        console.log(error)
    })