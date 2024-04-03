const {info, error} = require('./logger')

const requestLogger = (req, res, next) => {
    info('Method:', req.method)
    info('path:', req.path)
    info('body', req.body)
    info('---')
    next()
}

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (err, req, res, next) => {
    error(err.message)

    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id'})
    } else if (error.name === 'ValidationError') {
        return res.status(400).json({ error: err.message })
    }
}

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler
}