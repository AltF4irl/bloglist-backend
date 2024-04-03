const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs')
const config = require('./utils/config')
const logger = require('./utils/logger')
const {errorHandler, unknownEndpoint, requestLogger} = require('./utils/middleware')

mongoose.set('strictQuery', false)

mongoose.connect(config.MONGODB_URI)
.then(() => {
    logger.info("Connecting to", config.MONGODB_URI)
})
.catch(err => {
    logger.error('Error connecting to MongoDB:', err.message)
})

app.use(cors())
app.use(express.json())
app.use(requestLogger)

app.use('/api/blogs' ,blogsRouter)

app.use(unknownEndpoint)
app.use(errorHandler)

module.exports = app