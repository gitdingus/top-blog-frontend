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
      <p><Link to={`/authors/${unescape(blog.owner.doc.username)}`}>{
        blog.owner.doc.firstName !== undefined && blog.owner.doc.lastName !== undefined
        && unescape(`${blog.owner.doc.firstName} ${blog.owner.doc.lastName}`)
        || unescape(blog.owner.doc.username)
      }</Link></p>
    </div>
  )
}

export default BlogThumb;