const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (req, res) => {
    const blogs = await Blog.find({})
    res.json(blogs)
})
  
blogsRouter.post('/', async (req, res) => {

    if (!req.body.title || !req.body.url) {
        return res.status(400).json({error: 'content missing'})
    }

    const blogV2 = {
        title: req.body.title,
        author: req.body.author,
        url: req.body.url,
        likes: req.body.likes || 0
    }
  
    const blog = new Blog(blogV2)

    await blog.save()
    res.status(201).json(blog.toJSON())
})

module.exports = blogsRouter