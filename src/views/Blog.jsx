import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { unescape } from 'validator';
import CategoryButton from '../components/CategoryButton.jsx';
import defaultAuthorImage from '../images/account.png';

function Blog() {
  const params = useParams();
  const [ blog, setBlog ] = useState(null);
  const [ posts, setPosts ] = useState([]);

  useEffect(() => {
    if (!params.blogName) return;

    fetch(`http://localhost:3000/api/blogs/${params.blogName}`)
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        }
      })
      .then((data) => {
        setBlog(data.blog);
      });
  }, []);

  useEffect(() => {
    if (blog === null) return;

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
    return <div>Loading...</div>
  }

  if (blog.owner.status === 'Banned') {
    return <div>This blog has been banned</div>
  }

  return (
    <div className="content">
      <div className="author-info">
        <img src={blog.owner.image || defaultAuthorImage} alt='author' />
        <p>
          {
            (
              blog.owner.firstName 
              && blog.owner.lastName 
              && `${unescape(blog.owner.firstName)} ${unescape(blog.owner.lastName)}`
            ) ||
            `${unescape(blog.owner.username)}`
          }
        </p>
      </div>
      <div className="blog-info">
        <p>{unescape(blog.title)}</p>
        <p>{unescape(blog.description)}</p>
        <p>In category: <span><CategoryButton category={blog.category} /></span></p>
      </div>
      <div className="posts">
        <h1>Latest Posts</h1>
        {
          posts.length > 0 &&
          posts.map((post) => {
            return (
              <div className="post" key={post._id}>
                <p><Link to={`./${post._id}`}>{unescape(post.title)}</Link></p>
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