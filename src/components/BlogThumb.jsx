import React from 'react';
import { Link } from 'react-router-dom';
import { unescape } from 'validator'
import styles from '../styles/blog-thumb.module.css';

function BlogThumb({ blog }) {
  // title description  owner  created
  return (
    <div className={styles.blogThumb}>
      <p><Link to={`/${blog.name}`}>{unescape(blog.title)}</Link></p>
      <p>{unescape(blog.description || blog.preview)}</p>
      <p><Link to={`/authors/${unescape(blog.owner.username)}`}>{
        blog.owner.firstName !== undefined && blog.owner.lastName !== undefined
        && unescape(`${blog.owner.firstName} ${blog.owner.lastName}`)
        || unescape(blog.owner.username)
      }</Link></p>
    </div>
  )
}

export default BlogThumb;