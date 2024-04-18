const {test, describe, after, beforeEach} = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const {initialBlogs, getDB} = require('./test_helper')

const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})

    const blogsArray = initialBlogs.map(blog => new Blog(blog))
    const promiseArray = blogsArray.map(blog => blog.save())
    await Promise.all(promiseArray)
})

test('blogs are coming in JSON format', async () => {
    await api   
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('unique identifier is id and not _id', async () => {
    const blog = await Blog.findOne({})
    const blogToJson = blog.toJSON()
    console.log(blogToJson)

    assert(!Object.keys(blogToJson).includes("_id") && Object.keys(blog.toJSON()).includes("id"))
    console.log(Object.keys(blogToJson))
})

test('post request creates a new blog', async () => {
    const blogsAtStart = await getDB()

    const newBlog = {
        title: 'you are my sunshine',
        author: 'my only sunshine',
        url: 'you make me happy',
        likes: 19
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await getDB()

    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length + 1)

})

test('if likes is missing should be 0', async () => {
    const newBlog = {
        title: 'you are my sunshine',
        author: 'my only sunshine',
        url: 'you make me happy',
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const queryBlog = await Blog.findOne({title: 'you are my sunshine'})
    console.log(queryBlog.toJSON())

    assert.strictEqual(queryBlog.likes, 0)
})

test.only('if title or url are missing return 400', async () => {
    const newBlogV1 = {
        author: 'my only sunshine',
        url: 'you make me happy',
    }

    const newBlogV2 = {
        title: 'you are my sunshine',
        author: 'my only sunshine',
    }

    await api
        .post('/api/blogs')
        .send(newBlogV1)
        .expect(400)

    await api
        .post('/api/blogs')
        .send(newBlogV2)
        .expect(400)
})

after(async () => {
    await mongoose.connection.close()
})
