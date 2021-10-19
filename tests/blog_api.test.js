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

  test('likes default to 0 when missing', async () => {
    const newBlog = {
      _id: '5a493ac71b54a676234d17f8',
      title: 'Test blog 2',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.someurl.com'
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const resultBlog = await api
      .get(`/api/blogs/${newBlog._id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(resultBlog.body.likes).toBe(0)  
  })

  test('blog cannot be added without title or url', async () => {
    const newBlog = {
      _id: '5a493ac71b54a676234d17f8',
      author: 'Edsger W. Dijkstra',
      liks: 0
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })

  test('deleting blog succesfully', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToRemove = blogsAtStart[0]
    await api
      .delete(`/api/blogs/${blogToRemove.id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)
  })

  afterAll(() => {
    mongoose.connection.close()
  })
})