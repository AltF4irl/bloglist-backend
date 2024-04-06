const {test, describe} = require('node:test')
const assert = require('node:assert')
const {dummy, totalLikes, favoriteBlog} = require('../utils/list_helper')

const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    }
]

const blogs = [
    {
      _id: "5a422a851b54a676234d17f7",
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 7,
      __v: 0
    },
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      __v: 0
    },
    {
      _id: "5a422b3a1b54a676234d17f9",
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      __v: 0
    },
    {
      _id: "5a422b891b54a676234d17fa",
      title: "First class tests",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
      likes: 10,
      __v: 0
    },
    {
      _id: "5a422ba71b54a676234d17fb",
      title: "TDD harms architecture",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
      likes: 0,
      __v: 0
    },
    {
      _id: "5a422bc61b54a676234d17fc",
      title: "Type wars",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
      likes: 2,
      __v: 0
    }  
]

const blogsWithMoreThanOneFavorite = [
    {
      _id: "5a422a851b54a676234d17f7",
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 7,
      __v: 0
    },
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      __v: 0
    },
    {
      _id: "5a422b3a1b54a676234d17f9",
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      __v: 0
    },
    {
      _id: "5a422b891b54a676234d17fa",
      title: "First class tests",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
      likes: 12,
      __v: 0
    },
    {
      _id: "5a422ba71b54a676234d17fb",
      title: "TDD harms architecture",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
      likes: 0,
      __v: 0
    },
    {
      _id: "5a422bc61b54a676234d17fc",
      title: "Type wars",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
      likes: 2,
      __v: 0
    }  
]

test('dummy returns one', () => {
    const blogs = []

    const result = dummy(blogs)
    assert.strictEqual(result, 1)
})

describe('Total Likes', () => {
    
    test('of empty list is zero', () => {
        const result = totalLikes([])
        assert.strictEqual(result, 0)
    })

    test('when list has only one blog equals the likes of that', () => {
        const result = totalLikes(listWithOneBlog)
        assert.strictEqual(result, 5)
    })

    test('of a bigger list is calculated right', () => {
        const result = totalLikes(blogs)
        assert.strictEqual(result, 36)
    })

})

describe('Favorite Blog', () => {
    const trimmedBlogs = blogs.map(blog => {
        return{
            title: blog.title,
            author: blog.author,
            likes: blog.likes
        }
    })
    // console.log(trimmedBlogs)
    const trimmedBlogsWithMoreThanOneFavorite = blogsWithMoreThanOneFavorite.map(blog => {
        return{
            title: blog.title,
            author: blog.author,
            likes: blog.likes
        }
    })
    const trimmedListWithOneBlog = [{
        title: listWithOneBlog[0].title,
        author: listWithOneBlog[0].author,
        likes: listWithOneBlog[0].likes
    }]
    // console.log(trimmedListWithOneBlog)
    const dummyObject = {
        title: "dummy",
        author: "mr. dummy",
        likes: 0
    }
    
    test('of empty list is dummy object', () => {
        const result = favoriteBlog([])
        assert.deepStrictEqual(result, dummyObject)
    })

    test('when list has only one blog should be that', () => {
        const result = favoriteBlog(trimmedListWithOneBlog)
        assert.deepStrictEqual(result, trimmedListWithOneBlog[0])
    })

    test('when there is only one favorite return it', () => {
        const result = favoriteBlog(trimmedBlogs)
        assert.deepStrictEqual(result, {
            title: "Canonical string reduction",
            author: "Edsger W. Dijkstra",
            likes: 12,
          })
    })
    
    const thisOrThat = {
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        likes: 12,
      } || {
        title: "First class tests",
        author: "Robert C. Martin",
        likes: 12,
      }

    test('If there are many top favorites, it is enough to return one of them', () => {
        const result = favoriteBlog(trimmedBlogsWithMoreThanOneFavorite)
        assert.deepStrictEqual(result, thisOrThat)
    })
})

