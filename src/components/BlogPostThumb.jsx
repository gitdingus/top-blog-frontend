import React from 'react';
import { Link } from 'react-router-dom';
import { unescape } from 'validator';
import CategoryButton from './CategoryButton.jsx';

import '../styles/blogpostthumb.css';

function BlogPostThumb({ post }) {
  return (
    <div className="blog-post-thumb">
      <p className="author-category">
        <span>
          <Link to={`./authors/${post.author.doc.username}`}>{
            (
              post.author.doc.firstName !== undefined && post.author.doc.lastName !== undefined
              && `${post.author.doc.firstName} ${post.author.doc.lastName}`
            ) ||
            post.author.doc.username
          }</Link>
        </span>
        &nbsp;in&nbsp; 
        <CategoryButton category={post.blog.doc.category} />
      </p>
      <p className="title"><Link to={`./${post.blog.doc.name}/${post._id}`}>{unescape(post.title)}</Link></p>
      <p className="date">posted on: {new Date(post.created).toLocaleDateString()}</p>
    </div>
  )
}

export default BlogPostThumb;