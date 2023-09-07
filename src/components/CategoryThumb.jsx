import React from 'react';
import { Link } from 'react-router-dom';
import { unescape } from 'validator';
import styles from '../styles/category-thumb.module.css';

function CategoryThumb({ category }) {
  return (
    <div className={styles.categoryThumb}>
      <h2>
        <Link to={`/categories/${category._id}`}>{unescape(category.name) }</Link>
      </h2>
      <p>{ unescape(category.description) }</p>
    </div>
  )
}

export default CategoryThumb;
