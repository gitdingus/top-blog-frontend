import React, { useContext } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext.jsx';

function AdminPanel() {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  
  if (currentUser === null || (currentUser.accountType !== 'Admin' && currentUser.accountType !== 'Moderator')) {
    return <div>Access denied</div>
  }

  return (
    <div>
      <div>
        <ul>
          <li>
            <Link to="reports">View Reports</Link>
          </li>
        </ul>
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  )
}

export default AdminPanel;