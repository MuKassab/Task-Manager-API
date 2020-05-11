const mongoose = require('mongoose')
const fs = require('fs')

mongoose.connect(process.env.MONGODB_URL.toString(), {useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false, useUnifiedTopology: true})



