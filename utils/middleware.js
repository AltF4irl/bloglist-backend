const {info, error} = require('./logger')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

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
    }  else if (err.name ===  'JsonWebTokenError') {
        return res.status(401).json({ error: 'token invalid' })
    } else if (err.name === 'MongoServerError' && err.message.includes('E11000 duplicate key error')) {
        return res.status(400).json({ error: 'expected `username` to be unique' })
      }
}

const tokenExtractor = (req, res, next) => {
    const authorization = req.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
        req.token = authorization.replace('Bearer ', '')
        next()
    } else {
        req.token = null
        next()
    }
}

const userExtractor = async (req, res, next) => {
    const token = jwt.verify(req.token, process.env.SECRET)
    if (!token.id) {
        res.status(401).json({ error: 'invalid token' })
        next()
    }

    req.user = await User.findById(token.id)
    next()
}

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler,
    tokenExtractor,
    userExtractor
}