const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})


// blogsRouter.post('/', async (request, response) => {
//   const blog = new Blog(request.body)
//   const savedBlog = await blog.save()
//   response.json(savedBlog)
// })

blogsRouter.post('/', async (request, response) => {
  const body = request.body
  
  if (body.title && body.url) {

    const blog = new Blog({
      _id: body._id,
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0
    })
    const savedBlog = await blog.save()
    response.json(savedBlog)
  } else {
    response.status(400).end()
  }
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

module.exports = blogsRouter