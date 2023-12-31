import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { unescape } from 'validator';
import CommentArea from '../components/CommentArea.jsx';
import ReportContent from '../components/ReportContent.jsx';
import defaultAuthorImage from '../images/account.png';
import styles from '../styles/blogpost.module.css';
import imageStyles from '../styles/images.module.css';

function BlogPost() {
  const params = useParams();
  const [ blogPost, setBlogPost ] = useState(null);

  useEffect(() => {
    if (!params.postId) return;

    fetch(`${FETCH_BASE_URL}/blogs/post/${params.postId}`)
      .then(async (res) => {
        if (res.status === 200) {
          const data = await res.json();

          setBlogPost(data.post);
        }
      })
  }, []);

  if (blogPost === null) {
    return <div>Loading blog post...</div>
  }

  return (
    <div className={styles.blogContent}>
      <div className={styles.authorInfo}>
        <img className={imageStyles.profileImage} src={blogPost.author.doc.image || defaultAuthorImage} alt="author" />
        <p>
          {
            (
              blogPost.author.doc.firstName 
              && blogPost.author.doc.lastName 
              && `${unescape(blogPost.author.doc.firstName)} ${unescape(blogPost.author.doc.lastName)}`
            ) ||
            `${unescape(blogPost.author.doc.username)}`
          }
        </p>
      </div>
      <header className={styles.articleHeader}>
        <div>
          <p><Link to={`/${blogPost.blog.doc.name}`}>{unescape(blogPost.blog.doc.title)}</Link></p>
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
      <div className={styles.reportForm}>
        <ReportContent contentType='BlogPost' contentId={params.postId} reportedUser={blogPost.author.doc.username}/>
      </div>
    </div>
  )
}

export default BlogPost;