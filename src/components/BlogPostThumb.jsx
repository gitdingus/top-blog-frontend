import React from 'react';
import { Link } from 'react-router-dom';
import { unescape } from 'validator';
import CategoryButton from './CategoryButton.jsx';

function BlogPostThumb({ post }) {
  return (
    <div className="blog-post">
      <p>
        <span>
          <Link to={`./authors/${post.author.username}`}>{unescape(post.author.username)}</Link>
        </span>
        &nbsp;in&nbsp; 
        <CategoryButton category={post.blog.category} />
      </p>
      <p><Link to={`./${post.blog.name}/${post._id}`}>{unescape(post.title)}</Link></p>
      <p>posted on: {new Date(post.created).toLocaleString()}</p>
    </div>
  )
}

export default BlogPostThumb;