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
          <Link to={`./authors/${post.author.username}`}>{
            (
              post.author.firstName !== undefined && post.author.lastName !== undefined
              && `${post.author.firstName} ${post.author.lastName}`
            ) ||
            post.author.username
          }</Link>
        </span>
        &nbsp;in&nbsp; 
        <CategoryButton category={post.blog.category} />
      </p>
      <p className="title"><Link to={`./${post.blog.name}/${post._id}`}>{unescape(post.title)}</Link></p>
      <p className="date">posted on: {new Date(post.created).toLocaleDateString()}</p>
    </div>
  )
}

export default BlogPostThumb;