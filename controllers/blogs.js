const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')
const Comment = require('../models/comment')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({})
    .populate('user', { username: 1, name: 1 })
    .populate('comments', { content: 1 })
  res.json(blogs)
})

blogsRouter.post('/', userExtractor, async (req, res) => {
  if (!req.body.title || !req.body.url) {
    return res.status(400).json({ error: 'content missing' })
  }

  const user = req.user
  console.log(user, 'user returned in the request')

  const blogV2 = {
    title: req.body.title,
    author: req.body.author,
    url: req.body.url,
    likes: req.body.likes || 0,
    user: user._id,
  }
  const blog = new Blog(blogV2)
  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  res.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', userExtractor, async (req, res) => {
  const user = req.user
  console.log('user', user)
  const blog = await Blog.findById(req.params.id)

  console.log('user', user, 'enduser')

  const updatedBlogs = user.blogs.filter(
    (blogid) => blogid.toString() !== blog.id
  )

  if (blog.user.toString() !== user.id) {
    return res.status(401).json({ error: 'invalid user or token' })
  }

  await User.findByIdAndUpdate(
    user.id,
    { blogs: updatedBlogs },
    { new: true, runValidators: true }
  )
  await Blog.findByIdAndDelete(req.params.id)
  res.status(204).end()
})

blogsRouter.put('/:id', async (req, res) => {
  const blogInReq = {
    title: req.body.title,
    author: req.body.author,
    url: req.body.url,
    likes: req.body.likes,
    user: req.user,
  }
  console.log(req.body, 'req')
  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blogInReq, {
    new: true,
    runValidators: true,
  })
  res.json(updatedBlog)
})

// Comment section

blogsRouter.get('/:id/comments', async (req, res) => {
  const comments = await Comment.find({ blog: req.params.id }).populate('blog', {id: 1})
  res.json(comments)
})

blogsRouter.post('/:id/comments', userExtractor, async (req, res) => {
  if (!req.body.content) {
    return res.status(400).json({ error: 'content missing' })
  }

  const blog = await Blog.findById(req.params.id)

  console.log('blog', blog)

  const commentTemp = {
    content: req.body.content,
    user: req.user._id,
    blog: blog._id,
  }

  const comment = new Comment(commentTemp)
  const savedComment = await comment.save()

  blog.comments = blog.comments.concat(savedComment._id)
  await blog.save()

  res.json(savedComment)
})

module.exports = blogsRouter
