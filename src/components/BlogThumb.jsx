import React from 'react';
import { Link } from 'react-router-dom';
import { unescape } from 'validator'

function BlogThumb({ blog }) {
  // title description  owner  created
  return (
    <div>
      <p><Link to={`/${blog.name}`}>{unescape(blog.title)}</Link></p>
      <p>{unescape(blog.description || blog.preview)}</p>
      <p><Link to={`/authors/${unescape(blog.owner.username)}`}>{unescape(blog.owner.username)}</Link></p>
    </div>
  )
}

export default BlogThumb;