const express = require('express')


//By calling require the file runs and that connects to the database
const init = require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
app.use(express.json())

// ***************************User Routes************************
app.use(userRouter)

// ***************************Task Routes************************
app.use(taskRouter)


module.exports = app