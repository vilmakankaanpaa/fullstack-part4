const listHelper = require('../utils/list_helper')
const helper = require('./test_helper')

describe('total likes', () => {

  test('counting likes in test array of blogs', () => {
    const result = listHelper.totalLikes(helper.initialBlogs)
    expect(result).toBe(36)
  })
})