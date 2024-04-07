const blog = require("../models/blog")
const _ = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => {
        return blog.likes + sum
    }, 0)
}

const favoriteBlog = (blogs) => {


    if (blogs.length === 1 && blogs.length !== 0) {
        const { title, author, likes } = blogs[0]
        return {
            title,
            author,
            likes
        }
    } else if(blogs.length !== 0) {
        const blogLikes = blogs.map(blog => blog.likes)
        const favorite = blogs.find(blog => blog.likes === Math.max(...blogLikes))
        const { title, author, likes } = favorite
        return { title, author, likes }
    }
    
    return {
        title: "dummy",
        author: "mr. dummy",
        likes: 0
    }
}

// const blogs = [
//     {
//       _id: "5a422a851b54a676234d17f7",
//       title: "React patterns",
//       author: "Michael Chan",
//       url: "https://reactpatterns.com/",
//       likes: 7,
//       __v: 0
//     },
//     {
//       _id: "5a422aa71b54a676234d17f8",
//       title: "Go To Statement Considered Harmful",
//       author: "Edsger W. Dijkstra",
//       url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
//       likes: 5,
//       __v: 0
//     },
//     {
//       _id: "5a422b3a1b54a676234d17f9",
//       title: "Canonical string reduction",
//       author: "Edsger W. Dijkstra",
//       url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
//       likes: 12,
//       __v: 0
//     },
//     {
//       _id: "5a422b891b54a676234d17fa",
//       title: "First class tests",
//       author: "Robert C. Martin",
//       url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
//       likes: 10,
//       __v: 0
//     },
//     {
//       _id: "5a422ba71b54a676234d17fb",
//       title: "TDD harms architecture",
//       author: "Robert C. Martin",
//       url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
//       likes: 0,
//       __v: 0
//     },
//     {
//       _id: "5a422bc61b54a676234d17fc",
//       title: "Type wars",
//       author: "Robert C. Martin",
//       url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
//       likes: 2,
//       __v: 0
//     }  
// ]

// const listWithOneBlog = [
//     {
//       _id: '5a422aa71b54a676234d17f8',
//       title: 'Go To Statement Considered Harmful',
//       author: 'Edsger W. Dijkstra',
//       url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
//       likes: 5,
//       __v: 0
//     }
// ]

const mostLikes = (blogs) => {//[{...}]
    if(blogs.length === 0 ) {
        return {author: 'mr. dummy', likes: 0}
    } /*else if(blogs.length === 1) {
        return [{author: blogs[0].author, likes: blogs[0].likes}]
    }*/

    const likesPerAuthor = _(blogs)
                                .groupBy('author')
                                .map((authorObject, author) => {
                                    return {
                                        author: author,
                                        likes: _.sumBy(authorObject, 'likes')
                                    }
                                })
                                .value()

    const maxLikes = Math.max(...likesPerAuthor.map(author => author.likes))

    const authorWithMaxLikes = likesPerAuthor.find(author => author.likes === maxLikes)

    return authorWithMaxLikes
}

const mostBlogs = (blogs) => {
    if(blogs.length === 0 ) {
        return {author: 'mr. dummy', likes: 0}
    }

    const blogsPerAuthor = _(blogs)
                                .groupBy('author')
                                .map((authorArray, author) => {
                                    return {
                                        author: author,
                                        blogs: authorArray.length
                                    }
                                })

    const maxBlogsPerAuthor = Math.max(...blogsPerAuthor.map(blog => blog.blogs))

    return blogsPerAuthor.find(author => author.blogs === maxBlogsPerAuthor)
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostLikes,
    mostBlogs
}