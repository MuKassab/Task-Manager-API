const mongoose = require('mongoose')
const fs = require('fs')

//Connection to MongooseDB
//URL is stored as an environment variable for security
mongoose.connect(process.env.MONGODB_URL.toString(), {useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false, useUnifiedTopology: true})
