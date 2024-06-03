const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')


usersRouter.get('/', async (req, res) => {
    const users = await User.find({}).populate('blogs')
    res.json(users)
})

usersRouter.get('/:id', async (req, res) => {
    const id = req.params.id
    console.log(id)
    const user = await User.findById(id).populate('blogs')
    if (!user) {
        return res.status(404).json({error: 'something went wrong'})
    }
    return res.json(user)
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

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)


    const user = new User ({
        username,
        name,
        passwordHash
    })

    const savedUser = await user.save()

    res.status(201).json(savedUser)
})

module.exports = usersRouter