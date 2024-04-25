const usersRouter = require('express').Router()
const User = require('../models/user')


usersRouter.get('/', async (req, res) => {
    const users = await User.find({}).populate('blogs')

    res.json(users)
})

usersRouter.post('/', async (req, res) => {
    const { username, name, password } = await req.body

    if (!password || password.length < 3) {
        return res.status(400).json({ error: 'password must consist of 3 characters or more' })
    }

    if (!username) {
        return res.status(400).json({ error: 'username must consist of 3 characters or more' })
    }

    const userFinder = await User.findOne({username})
    if (userFinder) {
        return res.status(400).json({ error: 'username already taken' })
    }

    const user = new User ({
        username,
        name,
    })

    const savedUser = await user.save()

    res.status(201).json(savedUser)
})

module.exports = usersRouter