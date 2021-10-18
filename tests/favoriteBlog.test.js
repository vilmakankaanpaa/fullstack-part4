const listHelper = require('../utils/list_helper')
const testHelper = require('./test_helper')

describe('favorite blog', () => {

  test('finding the most liked blog', () => {
    const result = listHelper.favoriteBlog(testHelper.initialBlogs)
    expect(result).toEqual(
      {
        _id: '5a422b3a1b54a676234d17f9',
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
        likes: 12
      }
    )
  })
})