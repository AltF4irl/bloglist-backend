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

    if (err.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id'})
    } else if (err.name === 'ValidationError') {
        return res.status(400).json({ error: err.message })
    }  else if (error.name ===  'JsonWebTokenError') {
        return response.status(401).json({ error: 'token invalid' })
    }
}

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler
}