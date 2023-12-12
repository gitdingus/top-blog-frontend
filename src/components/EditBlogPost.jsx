import React, { useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { unescape } from 'validator';
import { UserContext } from '../contexts/UserContext.jsx';
import getLoggedInUser from '../utils/getLoggedInUser.js';
import createErrorObject from '../utils/createErrorObject.js';
import '../styles/single-column-grid-form.css';

function EditBlogPost() {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const { blogPostId } = useParams();
  const [ post, setPost ] = useState(null);
  const [ message, setMessage ] = useState('');
  const [ errors, setErrors ] = useState({});
  const postTitle = useRef(null);
  const postContent = useRef(null);

  useEffect(() => {
    if (currentUser === null) return;
    if (blogPostId === undefined) return;

    fetch(`${FETCH_BASE_URL}/users/${currentUser._id}/blog-posts/${blogPostId}`, {
      credentials: 'include',
    })
      .then(async (res) => {
        if (res.status === 200) {
          const data = await res.json();

          setPost(data.post);
        } else {
          throw new Error("Bad status");
        }
      })
      .catch((err) => {
        setPost(null);
      });
  }, []);

  if (post === null) {
    return <div>Could not retrieve blog post</div>
  }

  const editPost = () => {
    fetch(`${FETCH_BASE_URL}/users/${currentUser._id}/blog-posts/${blogPostId}/edit`, {
      method: 'post',
      credentials: 'include',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        title: postTitle.current.value,
        content: postContent.current.value,
      }),
    })
      .then((res) => {
        if (res.status === 204) {
          setMessage('Successfully updated blog post');
        } else {
          setMessage('Can not edit blog post');
        }
      })
  }

  return (
    <div className="form-area single-column-grid-form">
      <form onSubmit={(e) => {
        e.preventDefault();

        getLoggedInUser()
          .then((userData) => {
            if (userData._id === currentUser._id) {
              editPost();
            } else {
              throw new Error("Session expired");
            }
          })
          .catch((err) => {
            console.log(err);
            setCurrentUser(null);
          });
      }}>
        { message !== '' && <p className="message">{message}</p> }
        <label htmlFor="title">Title</label>
        <input id="title" ref={postTitle} defaultValue={unescape(post.title)} />
        { errors.title !== undefined && <p className="error">{ errors.title }</p> }
        <label htmlFor="content">Content</label>
        <textarea id="content" ref={postContent} defaultValue={unescape(post.content)} />
        { errors.content !== undefined && <p className="error">{ errors.content }</p> }
        <button type="submit">Edit Post</button>
      </form>
    </div>
  )
}

export default EditBlogPost;