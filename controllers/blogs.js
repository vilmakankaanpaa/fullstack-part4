const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })

  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body
  
  if (body.title && body.url) {

    const users = await User.find({})
    console.log(users)

    const blog = new Blog({
      _id: body._id,
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
      user: users[0]
    })
    const savedBlog = await blog.save()

    // Add the blog to the user's blogs
    const currentUser = users[0]
    const user = {
      username: currentUser.username,
      name: currentUser.name,
      blogs: currentUser.blogs.concat(blog)
    }
    await User.findByIdAndUpdate(currentUser.id, user, { new: true })
  
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

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  console.log(updatedBlog)
  response.json(updatedBlog)
})

module.exports = blogsRouter