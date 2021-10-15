const totalLikes = (blogs) => {
  const counter = (sum, blog) => sum + blog.likes
  return blogs.reduce(counter, 0)
}

module.exports = {
  totalLikes
}