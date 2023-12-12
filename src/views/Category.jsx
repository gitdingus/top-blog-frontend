import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { unescape } from 'validator';
import BlogThumb from '../components/BlogThumb.jsx';
import styles from '../styles/category.module.css';

function Category() {
  const params = useParams();
  const [ category, setCategory ] = useState(null);
  const [ blogs, setBlogs ] = useState([]);
  useEffect(() => {
    if (params.categoryId === undefined) return;
    
    fetch(`${FETCH_BASE_URL}/blogs/categories/${params.categoryId}`)
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        }
      })
      .then((data) => {
        setCategory(data.category);
      });
  }, []);

  useEffect(() => {
    if (category === null) return; 

    fetch(`${FETCH_BASE_URL}/blogs?category=${category._id}`)
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        }
      })
      .then((data) => {
        setBlogs(data.blogs);
      });
  }, [ category ]);

  if (category === null) {
    return <div>Loading category</div>;
  }

  return (
    <div>
      <div className={styles.categoryHeader}>
        <h1>{unescape(category.name)}</h1>
        <p>{unescape(category.description)}</p>
      </div>
      <div>
        {
          blogs.map((blog) => (
            <BlogThumb blog={blog} key={blog._id} />
          ))
        }
      </div>
    </div>
  )
}

export default Category