import React from 'react';
import { Link } from 'react-router-dom';
import { unescape } from 'validator';

function CategoryThumb({ category }) {
  return (
    <div className="category">
    <h2>
      <Link to={`/categories/${category._id}`}>{unescape(category.name) }</Link>
    </h2>
    <p>{ unescape(category.description) }</p>
    </div>
  )
}

export default CategoryThumb;
