const app = require('./app')

const port = process.env.PORT

// ******************Start Listening**************************
app.listen(port, () => {
    console.log("Server is running on port", port)
})
