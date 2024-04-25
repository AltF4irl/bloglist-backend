const {test, describe, after, beforeEach} = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const {initialBlogs, initialUsers, getDB, getUserDB} = require('./test_helper')

const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})

    const blogsArray = initialBlogs.map(blog => new Blog(blog))
    const promiseArray = blogsArray.map(blog => blog.save())
    await Promise.all(promiseArray)

    await User.deleteMany({})

    const usersArray = initialUsers.map(user => new User(user))
    const userPromiseArray = usersArray.map(user => user.save())
    await Promise.all(userPromiseArray)
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

test('if title or url are missing return 400', async () => {
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

test('if blog is deleted it doesn\'nt exist anymore', async () => {
    const blogsAtFirst = await getDB()
    const blogToDelete = blogsAtFirst[3]

    await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

    const blogsAtEnd = await getDB()
    const blogIds = blogsAtEnd.map( blog => blog.id)

    assert(!blogIds.includes(blogToDelete.id))
    assert.strictEqual(blogsAtEnd.length, blogsAtFirst.length - 1)
})

test('if likes are updated the count is correct', async () => {
    const blogsAtStart = await getDB()
    const blogToUpdate = blogsAtStart[0]

    const newBlog = {...blogToUpdate, likes: 69}
    console.log(newBlog)

    await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(newBlog)

        console.log('we got here')
    const updatedBlogInDB = await Blog.findById(blogToUpdate.id)
    const blogsAtLast = await getDB()
    // const updatedBlogInDB = blogsAtLast[0]

    assert.strictEqual(updatedBlogInDB.likes, newBlog.likes)
    assert.strictEqual(updatedBlogInDB.title, blogToUpdate.title)
    assert.strictEqual(updatedBlogInDB.author, blogToUpdate.author)
    assert.strictEqual(updatedBlogInDB.url, blogToUpdate.url)
    assert.strictEqual(updatedBlogInDB.id, blogToUpdate.id)
    assert.strictEqual(blogsAtLast.length, blogsAtStart.length)
})

describe.only('user tests', () => {
    test.only('username should be unique', async () => {
        const firsUsername = await getUserDB()

        const newUser = {
            username: firsUsername[0].username,
            name: 'test',
            password: 'test'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
    })

    test.only('username should be 3 chars or more', async () => {
        const firsUser = await getUserDB()

        const newUser = {
            username: '12',
            name: 'test',
            password: 'test'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
    })

    test.only('password should be 3 chars or more', async () => {
        const firsUser = await getUserDB()

        const newUser = {
            username: '12',
            name: 'test',
            password: 'te'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
    })

    test.only('password is required', async () => {
        const firsUser = await getUserDB()

        const newUser = {
            username: '12',
            name: 'test',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
    })

    test.only('username is required', async () => {
        const firsUser = await getUserDB()

        const newUser = {
            name: 'test',
            password: 'test'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
    })
})


after(async () => {
    await mongoose.connection.close()
})
