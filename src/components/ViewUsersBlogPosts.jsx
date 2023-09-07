import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext.jsx';
import { unescape } from 'validator';
import getLoggedInUser from '../utils/getLoggedInUser.js';
import styles from '../styles/view-users-blog-posts.module.css';
import editSvg from '../images/clipboard-edit.svg';
import deleteSvg from '../images/delete.svg';

function ViewUsersBlogPosts() {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [ blogs, setBlogs ] = useState([]);
  const [ blogPosts, setBlogPosts ] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:3000/api/users/${currentUser._id}/blogs`, {
      credentials: 'include',
    })
      .then(async (res) => {
        if (res.status === 200) {
          const data = await res.json();

          setBlogs(data.blogs);
        } else {
          throw new Error('Access denied');
        }
      })
      .catch((err) => {
        console.log(err);
        setCurrentUser(null);
      });
  }, []);

  const getBlogPosts = (blogId) => {
    fetch(`http://localhost:3000/api/users/${currentUser._id}/blogs/${blogId}/posts?minimal=true`, {
      credentials: 'include',
    })
      .then(async (res) => {
        if (res.status === 200) {
          const data = await res.json();

          setBlogPosts(data.posts);
        }
      });
  }

  const deleteBlogPost = (blogPostId, blogPostTitle) => {
    if (confirm(`Delete blog post: ${blogPostTitle}?`)) {
      fetch(`http://localhost:3000/api/users/${currentUser._id}/blog-posts/${blogPostId}`, {
        method: 'delete',
        credentials: 'include',
      })
        .then((res) => {
          if (res.status === 204) {
            alert('Successfully deleted blog post');
          } else {
            alert('Failed to delete blog post');
          }
        });
    }
  }

  return (
    <>
      <form onSubmit={(e) => {
        e.preventDefault();
      }}>
      <select id="blogSelect" defaultValue="" onChange={(e) => {
        getLoggedInUser()
          .then((userData) => {
            if (userData._id === currentUser._id){
              getBlogPosts(e.target.value);
            } else {
              setCurrentUser(null);
            }
          })
          .catch((err) => {
            setCurrentUser(null);
          });
      }}>
        <option disabled value="">Select a blog</option>
        {
          blogs.map((blog) => (
              <option key={blog._id} value={blog._id}>{unescape(blog.title)}</option>
          ))
        }
      </select>
      </form>
      <ul>
        {
          blogPosts.length > 0 &&
          blogPosts.map((post) => (
            <li key={post._id} className={styles.blogLine}>
              <p>{unescape(post.title)}</p>
              <div className={styles.actions}>
                <Link to={`${post._id}/edit-blogpost`}>
                  <img src={editSvg} className={styles.menuButton} title="Edit Blog Post" alt={`edit blog post ${post.title}`} />
                </Link>
                <button type="button" className={styles.menuButton} onClick={() => {
                  getLoggedInUser()
                    .then((userData) => {
                      if (userData._id === currentUser._id) {
                        deleteBlogPost(post._id, unescape(post.title));
                      } else {
                        throw new Error('Session Expired');
                      }
                    })
                    .catch((err) => {
                      console.log(err);
                      setCurrentUser(null);
                    })
                }}>
                  <img src={deleteSvg} title="Delete Blog Post" alt={`delete blog post ${post.title}`} />
                </button>
              </div>
            </li>
          ))
          ||
          <p>There are no blog posts</p>
        }
      </ul>
    </>

  )
}

export default ViewUsersBlogPosts;