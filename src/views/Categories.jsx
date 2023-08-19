import React, { useEffect, useState } from 'react';
import CategoryThumb from '../components/CategoryThumb.jsx';

function Categories() {
  const [ categories, setCategories ] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/blogs/categories')
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        }
      })
      .then((data) => {
        setCategories(data.categories);
      });
  }, []);

  if (categories === null) {
    return <div>Loading Categories</div>
  }

  return (
    <div>
      {
        categories.map((category) => (
          <CategoryThumb key={category._id} category={category} />
        ))
      }
    </div>
  )
}

export default Categories;