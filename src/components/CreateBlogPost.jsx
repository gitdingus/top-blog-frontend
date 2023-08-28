import React, { useContext, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext.jsx';
import getLoggedInUser from '../utils/getLoggedInUser';
import createErrorObject from '../utils/createErrorObject';

function CreateBlogPost() {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const params = useParams();
  const titleInput = useRef(null);
  const contentArea = useRef(null);
  const [ message, setMessage ] = useState('');
  const [ errors, setErrors ] = useState({});

  const createPost = () => {
    console.log('createPost called');
    const title = titleInput.current.value;
    const content = contentArea.current.value;
    const userId = currentUser._id;
    const blogId = params.blogId;

    fetch(`http://localhost:3000/api/users/${userId}/blogs/${blogId}/create-post`, {
      method: 'post',
      credentials: 'include',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        title,
        content,
      }),
    })
      .then(async (res) => {
        console.log('fetched');
        if (res.status === 200 || res.status === 400) {
          const data = await res.json();

          if (res.status === 400) {
            setErrors(createErrorObject(data.errors));
            return;
          } else {
            setMessage('Blog post successfully created');
            setErrors({});
          }
        }
      });

    console.log('fetch called');
  }

  return (
    <div className="form-area single-column-grid-form">
      <form onSubmit={(e) => {
        e.preventDefault();

        getLoggedInUser()
          .then((userData) => {
            console.log(userData);
            console.log(currentUser);
            if (userData._id === currentUser._id) {
              console.log('creating post');
              createPost();
            }
          })
          .catch((err) => {
            if (err.message === "Session Expired") {
              setCurrentUser(null);
              setMessage("Session expired: Please log back in to create blog post");
            }
          });
      }}>
        { message !== '' && <p className="message">{ message }</p> }
        <label htmlFor="title">Title</label>
        <input id="title" ref={titleInput} type="text" />
        { errors.title !== undefined && <p className="error">{ errors.title }</p> }
        <label htmlFor="content">Content</label>
        <textarea id="content" ref={contentArea} />
        { errors.content !== undefined && <p className="error">{ errors.content }</p> }
        <button type="submit">Create Blog Post</button>
      </form>

    </div>
  )
}

export default CreateBlogPost;