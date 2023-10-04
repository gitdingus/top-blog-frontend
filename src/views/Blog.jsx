import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { unescape } from 'validator';
import CategoryButton from '../components/CategoryButton.jsx';
import defaultAuthorImage from '../images/account.png';
import styles from '../styles/blog.module.css';
import imageStyles from '../styles/images.module.css';

function Blog() {
  const params = useParams();
  const [ blog, setBlog ] = useState(null);
  const [ posts, setPosts ] = useState([]);
  const [ message, setMessage ] = useState('');
  useEffect(() => {
    if (!params.blogName) return;

    fetch(`http://localhost:3000/api/blogs/${params.blogName}`)
      .then(async (res) => {
        if (res.status === 200) {
          const data = await res.json();
          setBlog(data.blog);
        } else if (res.status === 403) {
          setMessage('Access not allowed');
        } else if (res.status === 404) {
          setMessage('Blog not found');
        }
      })
  }, []);

  useEffect(() => {
    if (blog === null) return;
    if (blog.owner.status === 'Banned') return;
    
    fetch(`http://localhost:3000/api/blogs/${params.blogName}/posts`)
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        }
      })
      .then((data) => {
        setPosts(data.posts);
      })
  }, [ blog ]);

  if (blog === null) {
    return <div>{message !== '' ? message : 'Loading...'}</div>
  }

  if (blog.owner.status === 'Banned') {
    return <div>This blog has been banned</div>
  }

  return (
    <div>
      <div className={styles.authorInfo}>
        <img className={imageStyles.profileImage} src={blog.owner.doc.image || defaultAuthorImage} alt='author' />
        <p>
          {
            (
              blog.owner.doc.firstName 
              && blog.owner.doc.lastName 
              && `${unescape(blog.owner.doc.firstName)} ${unescape(blog.owner.doc.lastName)}`
            ) ||
            `${unescape(blog.owner.doc.username)}`
          }
        </p>
      </div>
      <div className="blog-info">
        <h2>{unescape(blog.title)}</h2>
        <p>{unescape(blog.description)}</p>
        <p>In category: <span><CategoryButton category={blog.category} /></span></p>
      </div>
      <div className={styles.posts}>
        <h2>Latest Posts</h2>
        {
          posts.length > 0 &&
          posts.map((post) => {
            return (
              <div className="post" key={post._id}>
                <p><Link to={`./${post._id}`}>{unescape(post.title)}</Link></p>
                <p>{unescape(post.preview)}</p>
                <p>{new Date(post.created).toLocaleString()}</p>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default Blog;