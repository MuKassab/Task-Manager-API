const express = require('express')


//By calling require the file runs and that connects to the database
const init = require('./db/mongoose')

const User = require('./models/user')
const Task = require('./models/task')

const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()

const port = process.env.PORT

app.use(express.json())

// ***************************User Routes************************
app.use(userRouter)

// ***************************Task Routes************************
app.use(taskRouter)


// ******************Start Listening**************************
app.listen(port, () => {
    console.log("Server is running on port", port)
})


const fun = async () => {
    const user = await User.findById("5eb533d70a68e031084ceda9")
    await user.populate('tasks').execPopulate()
    console.log(user.tasks)
}

//fun()