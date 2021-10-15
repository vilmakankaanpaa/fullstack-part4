const totalLikes = (blogs) => {
  const counter = (sum, blog) => sum + blog.likes
  return blogs.reduce(counter, 0)
}

const favoriteBlog = (blogs) => {

  const reducer = (favorite, blog) => {
    const p = favorite ? favorite.likes : 0
    const v = blog.likes
    return ( p < v ? blog : favorite )
  }

  return blogs.reduce(reducer, undefined)
}

module.exports = {
  totalLikes,
  favoriteBlog
}