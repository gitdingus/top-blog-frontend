import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../contexts/UserContext.jsx';
import getLoggedInUser from '../utils/getLoggedInUser.js';
import createErrorObject from '../utils/createErrorObject.js';
import '../styles/single-column-grid-form.css';

function CreateBlog() {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [ name, setName ] = useState('');
  const [ title, setTitle ] = useState('');
  const [ description, setDescription ] = useState('');
  const [ category, setCategory ] = useState('');
  const [ categories, setCategories ] = useState([]);
  const [ errors, setErrors ] = useState({});
  const [ message, setMessage ] = useState('');

  useEffect(() => {
    fetch(`${FETCH_BASE_URL}/blogs/categories`)
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        }
      })
      .then((data) => {
        setCategories(data.categories);
      });
  }, []);

  function clear() {
    setName('');
    setTitle('');
    setCategory('');
    setDescription('');
    setErrors('');
    setMessage('');
  }

  function createBlog() {
    fetch(`${FETCH_BASE_URL}/users/${currentUser._id}/blogs/create-blog`, {
      method: 'post',
      headers: {
        'content-type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        name,
        title,
        description,
        category,
      }),
    })
      .then(async (res) => {
        if (res.status === 400 || res.status === 200) {
          const data = await res.json();

          clear();
          if (res.status === 400) {
            console.log(data.errors);
            setErrors(createErrorObject(data.errors));
            return;
          }

          setMessage('Blog created successfully');
        }
      });
  }

  return (
    <div className="form-area single-column-grid-form">
      <form onSubmit={(e) => {
        e.preventDefault();

        getLoggedInUser()
          .then((userData) => {
            if (userData._id === currentUser._id) {
              createBlog();
            }
          })
          .catch((error) => {
            if (error.message === 'Session Expired') {
              setCurrentUser(null);
              setMessage('Session expired: Please log back in to create blog');
            }
          });
      }}>
        { message !== '' && <p className="message">{message}</p> }
        <label htmlFor="name">Name</label>
        <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value) } />
        { errors.name !== undefined && <p className="error">{errors.name}</p> }
        <label htmlFor="title">Title</label>
        <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value) } />
        { errors.title !== undefined && <p className="error">{errors.title}</p> }
        <label htmlFor="description">Description</label>
        <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value) }></textarea>
        { errors.description !== undefined && <p className="error">{errors.description}</p> }
        <label htmlFor="categories">Category</label>
        <select id="categories" onChange={(e) => {
          setCategory(e.target.value);
        }}>
          <option disabled selected value>Select a category</option>
          {
            categories.map((category) => (
              <option key={category._id} value={category._id}>{category.name}</option>
            ))
          }
        </select>
        { errors.category !== undefined && <p className="error">{errors.category}</p>}
        <button type="submit">Create Blog</button>
      </form>
    </div>

  )
}

export default CreateBlog;