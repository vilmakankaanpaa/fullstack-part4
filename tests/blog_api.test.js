const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')

describe('api tests', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})

    const blogObjects = helper.initialBlogs
      .map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
  })

  describe('when there is initially some blogs saved', () => {
    test('all blogs are returned', async () => {
      const response = await api.get('/api/blogs')

      expect(response.body).toHaveLength(helper.initialBlogs.length)
    }, 100000)

    test('id of a blog is called id', async () => {

      const response = await api.get('/api/blogs')
      expect(response.body[0].id).toBeDefined()
    })
  })

  describe('addition of a new blog', () => {
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

    test('blog likes default to 0 when missing', async () => {
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
  })

  describe('deleting a blog', () => {
    test('deleting blog succesfully', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToRemove = blogsAtStart[0]
      await api
        .delete(`/api/blogs/${blogToRemove.id}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)
    })
  })

  describe('when there is initially one user in db', () => {
    beforeEach(async () => {
      await User.deleteMany({})
  
      const passwordHash = await bcrypt.hash('sekret', 10)
      const user = new User({ username: 'root', passwordHash })
  
      await user.save()
    })
  
    test('creation succeeds with a fresh username', async () => {
      const usersAtStart = await helper.usersInDb()
  
      const newUser = {
        username: 'mluukkai',
        name: 'Matti Luukkainen',
        password: 'salainen',
      }
  
      await api
        .post('/api/users')
        .send(newUser)
        .expect(200)
        .expect('Content-Type', /application\/json/)
  
      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
  
      const usernames = usersAtEnd.map(u => u.username)
      expect(usernames).toContain(newUser.username)
    })
  
    test('creation fails with proper statuscode and message if username already taken', async () => {
      const usersAtStart = await helper.usersInDb()
  
      const newUser = {
        username: 'root',
        name: 'Superuser',
        password: 'salainen',
      }
  
      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
  
      expect(result.body.error).toContain('`username` to be unique')
  
      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })
  })

  describe('invalid credentials return proper error code and message', () => {
    
    test('username cannot be missing', async () => {

      const usersAtStart = await helper.usersInDb()

      const newUser = {
        name: 'newuser',
        password: 'secret',
      }
  
      await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
  
      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('password cannot be missing', async () => {

      const usersAtStart = await helper.usersInDb()
      
      const newUser = {
        username: 'nuser',
        name: 'newuser',
      }
  
      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
  
      expect(result.body.error).toContain('password is missing')
  
      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('username must be at least 3 chars', async () => {
      const usersAtStart = await helper.usersInDb()
      
      const newUser = {
        username: 'vk',
        name: 'newuser',
        password: 'salainen'
      }
  
      await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
  
      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('password must be at least 3 chars', async () => {
      const usersAtStart = await helper.usersInDb()
      
      const newUser = {
        username: 'nuser',
        name: 'newuser',
        password: 'sl'
      }
  
      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
  
      expect(result.body.error).toContain('password must be at least three characters')
  
      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })
  })

  afterAll(() => {
    mongoose.connection.close()
  })
})