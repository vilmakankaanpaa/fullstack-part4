const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

describe('api tests', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})

    const blogObjects = helper.initialBlogs
      .map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  }, 100000)

  test('id of a blog is called id', async () => {

    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
  })

  test('blog is added succesfully', async () => {
    const newBlog = {
      _id: '5a490aa71b54a676234d17f8',
      title: 'Test blog',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.someurl.com',
      likes: 3
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
  }, 100000)

  afterAll(() => {
    mongoose.connection.close()
  })
})