import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { unescape } from 'validator';
import { UserContext } from '../contexts/UserContext.jsx';
import getLoggedInUser from '../utils/getLoggedInUser';
import pencilSvg from '../images/pencil.svg';
import editSvg from '../images/clipboard-edit.svg';
import deleteSvg from '../images/delete.svg';
import eyeOpenSvg from '../images/eye-open.svg';
import eyeOffSvg from '../images/eye-off.svg';
import '../styles/view-users-blogs.css';

function ViewUsersBlogs() {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [ blogs, setBlogs ] = useState([]);

  useEffect(() => {
    getLoggedInUser()
      .then((userData) => {
        if (currentUser._id === userData._id) {
          fetch(`http://localhost:3000/api/users/${currentUser._id}/blogs/`, {
            credentials: 'include',
          })
            .then((res) => {
              if (res.status === 200) {
                return (res.json());
              }
            })
            .then((data) => {
              setBlogs(data.blogs);
            })
            .catch((error) => {
              alert('Access to blogs not allowed');
            });
        }
      })
      .catch((error) => {
        setBlogs([]);
      })
  }, [currentUser]);

  const deleteBlog = (blogId, blogName) => {
    const confirm = window.confirm(`Delete blog ${blogName} and all its posts?`);
    
    if (confirm) {
      fetch(`http://localhost:3000/api/users/${currentUser._id}/blogs/${blogId}`, {
        method: 'delete',
        credentials: 'include',
      })
        .then((res) => {
          if (res.status === 204) {
            alert(`Blog ${blogName} has been deleted with all of its content`);
          } else {
            alert('Error deleting blog');
          }
        });
    }
  }

  const togglePrivate = (blogId) => {
    const blog = blogs.find((blog) => blog._id === blogId);
    const priv = (blog.private === undefined || blog.private === false) ? false : true;

    fetch(`http://localhost:3000/api/users/${currentUser._id}/blogs/${blogId}/edit`, {
      method: 'post',
      headers: {
        'content-type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        private: !priv,
      }),
    })
      .then((res) => {
        if (res.status === 200) {
          blog.private = !blog.private;
          setBlogs([...blogs]);
        }
      })
  }

  return (
    <div>
      <p>My Blogs</p>
      
      <ul>
        {
          blogs.length > 0 &&
          blogs.map((blog) => (
            <li key={blog._id} className="blog-line">
              <p>{unescape(blog.title)}</p>
              <div className="actions">
                <Link to={`${blog._id}/create-post`}><img className="menu-button" src={pencilSvg} title="Create blog post" alt={`create blog post for ${unescape(blog.title)}`} /></Link>
                <Link to={`${blog._id}/edit-blog`}><img className="menu-button" src={editSvg} title="Edit blog information" alt={`edit blog ${unescape(blog.title)}`} /></Link>
                <button type="button"
                  className="menu-button"
                  onClick={() => {
                    getLoggedInUser()
                      .then((userData) => {
                        if (userData._id === currentUser._id) {
                          togglePrivate(blog._id);
                        } else {
                          throw new Error('Session expired');
                        }
                      })
                      .catch((err) => {
                        alert('Please log back in to complete current operation');
                        setCurrentUser(null);
                      })  
                }}>
                  <img 
                    src={(blog.private === undefined || blog.private === false) ? eyeOpenSvg : eyeOffSvg }
                    title='Show/Hide Blog' alt={`show/hide blog ${blog.title}`}
                  />
                </button>
                <button type="button"
                  className="menu-button"
                  onClick={() => {
                    getLoggedInUser()
                      .then((userData) => {
                        if (userData._id === currentUser._id) {
                          deleteBlog(blog._id, blog.name);
                        } else {
                          throw new Error('Session expired');
                        }
                      })
                      .catch((err) => {
                        alert('Please log back in to complete current operation');
                      })
                  }}>
                    <img src={deleteSvg} title="Delete blog and all its posts" alt={`delete blog ${unescape(blog.title)}`} />
                </button>
              </div>
            </li>
          ))
          || <p>There are no blogs to display</p>
        }
      </ul>
    </div>
  )
}

export default ViewUsersBlogs;