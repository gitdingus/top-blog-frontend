import React from 'react';
import { Link } from 'react-router-dom';
import { unescape } from 'validator';

function CategoryButton({ category }) {
  return (
    <span>
      <Link to={`./categories/${category._id}`}>
        { unescape(category.name) }
      </Link>
    </span>
  )
}

export default CategoryButton;