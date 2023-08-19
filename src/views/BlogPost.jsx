import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { unescape } from 'validator';
import defaultAuthorImage from '../images/account.png';

function BlogPost() {
  const params = useParams();
  const [ blogPost, setBlogPost ] = useState(null);

  useEffect(() => {
    if (!params.postId) return;

    fetch(`http://localhost:3000/api/blogs/post/${params.postId}`)
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        }
      })
      .then((data) => {
        setBlogPost(data.post);
      });
  }, []);

  if (blogPost === null) {
    return <div>Loading blog post...</div>
  }

  return (
    <div className="content">
      <div className="author-info">
        <img src={blogPost.author.image || defaultAuthorImage} alt="author" />
        <p>
          {
            (
              blogPost.author.firstName 
              && blogPost.author.lastName 
              && `${unescape(blogPost.author.firstName)} ${unescape(blogPost.author.lastName)}`
            ) ||
            `${unescape(blogPost.author.username)}`
          }
        </p>
      </div>
      <div className="blog-info">
        <p><Link to={`/${blogPost.blog.name}`}>{unescape(blogPost.blog.title)}</Link></p>
      </div>
      <div className="post-info">
        <h1>{unescape(blogPost.title)}</h1>
        <p>Posted {new Date(blogPost.created).toLocaleString()}</p>
      </div>
      <div className="post-content">
        <p>{unescape(blogPost.content)}</p>
      </div>
    </div>
  )
}

export default BlogPost;