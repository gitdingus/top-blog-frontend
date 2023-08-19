import React, { useContext } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext.jsx';

function Preferences() {
  const activeUser = useContext(UserContext);
  const location = useLocation();

  if (activeUser === null) {
    return <div></div>
  }

  return (
    <div>
      <ul>
        <li className={`${location.pathname.match(/change-password/) !== null ? 'active-page' : ''}`}>
          <Link to="change-password">Change Password</Link>
        </li>
        <li className={`${location.pathname.match(/personal-info/) !== null ? 'active-page' : ''}`}>
          <Link to="personal-info">Update Personal Information</Link>
        </li>
        <li className={`${location.pathname.match(/settings/) !== null ? 'active-page' : ''}`}>
          <Link to="settings">Update Settings</Link>
        </li>
      </ul>
      <Outlet />
    </div>

  )
}

export default Preferences;