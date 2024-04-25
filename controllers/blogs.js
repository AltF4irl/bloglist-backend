const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (req, res) => {
    const blogs = await Blog.find({}).populate('user', {username: 1, name: 1})
    res.json(blogs)
})
  
blogsRouter.post('/', async (req, res) => {

    if (!req.body.title || !req.body.url) {
        return res.status(400).json({error: 'content missing'})
    }

    const user = await User.findById(req.body.user)

    const blogV2 = {
        title: req.body.title,
        author: req.body.author,
        url: req.body.url,
        likes: req.body.likes || 0,
        user: user.id
    }
    const blog = new Blog(blogV2)
    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    res.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (req, res) => {
    await Blog.findByIdAndDelete(req.params.id)
    res.status(204).end()
})

blogsRouter.put('/:id', async (req, res) => {
    const blogInReq = {
        title: req.body.title,
        author: req.body.author,
        url: req.body.url,
        likes: req.body.likes,
    }

    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blogInReq, {new: true})
    res.json(updatedBlog)
})

module.exports = blogsRouter