import React, { useContext, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext.jsx';
import getLoggedInUser from '../utils/getLoggedInUser.js';
import styles from '../styles/blog-manager.module.css';

function BlogManager() {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const location = useLocation();
  
  if (currentUser === null) {
    return <div>Log in to access this page</div>
  }

  return (
    <div className={styles.blogManager}>
      <ul className={styles.blogOptions}>
        <li className={location.pathname.match(/create-blog/) !== null ? styles.active : ''}><Link to="create-blog">Create Blog</Link></li>
        <li className={location.pathname.match(/\/blogs$/) !== null ? styles.active : ''}><Link to="blogs">View Blogs</Link></li>
        <li className={location.pathname.match(/\/blogposts$/) !== null ? styles.active : ''}><Link to="blogposts">View Blog Posts</Link></li>
      </ul>
      <div className={styles.screen}>
        <Outlet />
      </div>
    </div>
  )
}

export default BlogManager;