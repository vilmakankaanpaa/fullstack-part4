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

// const mostBlogs = (blogs) => {

//   // Add auhtor to list if not exist
//   // Add on to the sum value of blogs and likes of the author

//   // {author: { blogs: 0, likes: 0}, author2: {...}, ...}

//   // pick author, then filter his blogs, then pull them out, and do same for the rest

//   let authors = []
//   const bloggerList = blogs
//     .reduce((bloggers, blog) => {
//       authors.push(blog.author)

//       // bloggers[blog.author] = bloggers[blog.author] || [] 
//       // bloggers[blog.author].push({
//       //   name: blog.title,
//       //   likes: blog.likes
//       // })
//       return bloggers
//     }, {})

//   console.log(bloggerList)
//   console.log('authors:',authors)

//   bloggerList.reduce((topBlogger, blogger) => {
//     console.log(blogger.key, blogger.values.length)
//   },{})

//   return {
//     author: 'A',
//     blogs: 0
//   }
// }

module.exports = {
  totalLikes,
  favoriteBlog
}