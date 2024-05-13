const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const config = require('./utils/config')
const logger = require('./utils/logger')
const {errorHandler, unknownEndpoint, requestLogger, tokenExtractor} = require('./utils/middleware')


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
app.use(tokenExtractor)
app.use(requestLogger)

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

if (process.env.NODE_ENV === 'test') {
    const testingRouter = require('./controllers/testing')
    app.use('/api/testing', testingRouter)
}

app.use(unknownEndpoint)
app.use(errorHandler)

module.exports = app