import React, { useContext, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext.jsx';
import styles from '../styles/preferences.module.css';
function Preferences() {
  const activeUser = useContext(UserContext);
  const location = useLocation();

  if (activeUser === null) {
    return <div></div>
  }

  return (
    <div className={styles.preferencesMenu}>
      <ul className={styles.preferencesOptions}>
        <li className={`${location.pathname.match(/change-password/) !== null ? styles.active : ''}`}>
          <Link to="change-password">Change Password</Link>
        </li>
        <li className={`${location.pathname.match(/personal-info/) !== null ? styles.active : ''}`}>
          <Link to="personal-info">Update Personal Information</Link>
        </li>
        <li className={`${location.pathname.match(/settings/) !== null ? styles.active : ''}`}>
          <Link to="settings">Update Settings</Link>
        </li>
        <li className={`${location.pathname.match(/profile-pic/) !== null ? styles.active : ''}`}>
          <Link to="profile-pic">Profile Picture</Link>
        </li>
      </ul>
      <div className={styles.preferences}>
        <Outlet />
      </div>
    </div>

  )
}

export default Preferences;