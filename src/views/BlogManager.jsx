import React, { useContext } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext.jsx';

function BlogManager() {
  const { currentUser } = useContext(UserContext);

  return (
    <div>
      <ul>
        <li><Link to="create-blog">Create Blog</Link></li>
        <li><Link to="blogs">View Blogs</Link></li>
      </ul>
      <Outlet />
    </div>
  )
}

export default BlogManager;