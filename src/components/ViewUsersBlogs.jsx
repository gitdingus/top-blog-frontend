import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { unescape } from 'validator';
import { UserContext } from '../contexts/UserContext.jsx';
import getLoggedInUser from '../utils/getLoggedInUser';
import pencilSvg from '../images/pencil.svg';
import editSvg from '../images/clipboard-edit.svg';
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

  return (
    <div>
      <p>My Blogs</p>
      
      <ul>
        {
          blogs.map((blog) => (
            <li key={blog._id} className="blog-line">
              <p>{unescape(blog.title)}</p>
              <div className="actions">
                <Link to={`${blog._id}/create-post`}><img className="menu-button" src={pencilSvg} title="Create blog post" alt={`create blog post for ${unescape(blog.title)}`} /></Link>
                <Link to={`${blog._id}/edit-blog`}><img className="menu-button" src={editSvg} title="Edit blog information" alt={`edit blog ${unescape(blog.title)}`} /></Link>
              </div>
            </li>
          ))
        }
      </ul>
    </div>
  )
}

export default ViewUsersBlogs;