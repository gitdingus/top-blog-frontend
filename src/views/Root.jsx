import React, { useEffect, useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext.jsx';
import AccountManager from '../components/AccountManager.jsx';

import '../styles/nav-styles.css';

function ReaderRoot() {
  const [ currentUser, setCurrentUser ] = useState(null);

  useEffect(() => {
    if (currentUser === null) {
      fetch('http://localhost:3000/api/current-user', {
        credentials: 'include',
      })
        .then((res) => {
          if (res.status === 200) {
            res.json()
              .then((user) => {
                setCurrentUser(user);
              });
          }
        });
    }
  }, []);

  return (
    <div>
      <UserContext.Provider value={{currentUser, setCurrentUser}}>
        <header>
          <nav>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="categories">Categories</Link></li>
              { currentUser !== null 
                && currentUser.accountType === 'Blogger'
                && <li><Link to="manage-blogs">Manage Blogs</Link></li>}
            </ul>
          </nav>
          <AccountManager />
        </header>
        <Outlet />
      </UserContext.Provider>
    </div>
  )
}

export default ReaderRoot;