import React, { useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { unescape } from 'validator';
import { UserContext } from '../contexts/UserContext.jsx';
import getLoggedInUser from '../utils/getLoggedInUser.js';
import createErrorObject from '../utils/createErrorObject.js';
import '../styles/single-column-grid-form.css';

function EditBlog() {
  const [ message, setMessage ] = useState('');
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [ blog, setBlog ] = useState(null);
  const [ errors, setErrors ] = useState({});
  const params = useParams();
  const blogTitle = useRef(null);
  const blogDescription = useRef(null);
  
  useEffect(() => {
    if (currentUser === null) return;
    if (params.blogId === null) return;

    fetch(`http://localhost:3000/api/users/${currentUser._id}/blogs/${params.blogId}`, {
      credentials: 'include',
    })
      .then((res) => {
        if (res.status === 200) {
          setMessage('');
          return res.json();
        } else {
          throw new Error(res.status);
        }
      })
      .then((data) => {
        setBlog(data.blog);
      })
      .catch((error) => {
        setMessage('Blog details can not be accessed at this time');
      });

  }, [ currentUser ]);

  function editBlog() {
    fetch(`http://localhost:3000/api/users/${currentUser._id}/blogs/${params.blogId}/edit`, {
      method: 'post',
      credentials: 'include',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        title: blogTitle.current.value,
        description: blogDescription.current.value,
      }),
    })
      .then(async (res) => {
        setMessage('');
        setErrors({});
        if (res.status === 400 || res.status === 200) {
          const data = await res.json();

          console.log(data);
          if (res.status === 400) {
            setErrors(createErrorObject(data.errors));
            setBlog(data.blog);
            return;
          }

          setMessage('Blog updated successfully');
          setBlog(data.blog);
        }
      });
  }

  if (currentUser === null) {
    return <div>Log in to view this page</div>
  }

  if (blog === null) {
    return <div>Loading</div>
  }

  return (
    <div className="form-area single-column-grid-form">
      <form onSubmit={(e) => {
        e.preventDefault();

        getLoggedInUser()
          .then((userData) => {
            if (userData._id === currentUser._id) {
              editBlog();
            } else {
              throw new Error(403);
            }
          })
          .catch((error) => {
            setCurrentUser(null);
            setMessage('Session expired: Please log back in to make changes');
          });
      }}>
        { message !== '' && <p className="message">{message}</p> }
        <label htmlFor="title">Title</label>
        <input id="title" type="text" defaultValue={unescape(blog.title)} ref={blogTitle} />
        { errors.title !== undefined && <p className="error">{errors.title}</p>}
        <label htmlFor="description">Description</label>
        <textarea id="description" defaultValue={unescape(blog.description)} ref={blogDescription}></textarea>
        { errors.description !== undefined && <p className="error">{errors.description}</p> }
        <button type="submit">Edit Blog Details</button>
      </form>
    </div>
  )
}

export default EditBlog;