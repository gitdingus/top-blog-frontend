import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { unescape } from 'validator';
import CommentArea from '../components/CommentArea.jsx';
import defaultAuthorImage from '../images/account.png';
import styles from '../styles/blogpost.module.css';
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
    <div className={styles.blogContent}>
      <div className={styles.authorInfo}>
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
      <header className={styles.articleHeader}>
        <div>
          <p><Link to={`/${blogPost.blog.name}`}>{unescape(blogPost.blog.title)}</Link></p>
        </div>
        <div>
          <h1>{unescape(blogPost.title)}</h1>
          <p>Posted {new Date(blogPost.created).toLocaleString()}</p>
        </div>
      </header>
      <div className={styles.postContent}>
        <p>{unescape(blogPost.content)}</p>
      </div>
      <div className={styles.commentArea}>
        <CommentArea />
      </div>
    </div>
  )
}

export default BlogPost;