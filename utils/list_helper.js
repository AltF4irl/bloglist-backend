const blog = require("../models/blog")

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

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}