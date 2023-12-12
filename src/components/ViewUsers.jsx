import React, { useContext, useEffect, useReducer, useState } from 'react';
import { Link } from 'react-router-dom';
import { unescape } from 'validator';
import { UserContext } from '../contexts/UserContext.jsx';
import styles from '../styles/mod-table.module.css';
import editSvg from '../images/clipboard-edit.svg';

function ViewUsers() {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [ searchUrl, dispatchSearchUrl ] = useReducer(urlReducer, new URL(`${FETCH_BASE_URL}/moderation/users`));
  const [ lastUrl, setLastUrl ] = useState(null);
  const [ users, setUsers ] = useState([]);

  useEffect(() => {
    if (currentUser === null) {
      setUsers([]);
      return;
    }

    fetch(`${FETCH_BASE_URL}/moderation/users`, {
      credentials: 'include',
    })
      .then((res) => {
        setLastUrl(new URL(res.url));
        if (res.status === 200) {
          return res.json();
        }
      })
      .then((json) => {
        setUsers(json);
      });
  }, [currentUser]);

  const inputChanged = (e) => {
    dispatchSearchUrl({
      type: 'input',
      field: e.target.name,
      value: e.target.value,
    });
  }
  return (
    <div>
      <div>
        <form onSubmit={(e) => {
          e.preventDefault();
          fetch(searchUrl, {
            credentials: 'include',
          })
            .then((res) => {
              if (res.status === 200) {
                setLastUrl(new URL(res.url));
                return res.json();
              }
            })
            .then((jsonData) => {
              setUsers(jsonData);
            });
        }}>
          <p>
            <label htmlFor="username">Username</label>
            <input id="username" type="text" name="username" onChange={inputChanged} />
          </p>
          <p>
            <label htmlFor="first_name">First Name</label>
            <input id="first_name" type="text" name="first_name" onChange={inputChanged} />
          </p>
          <p>
            <label htmlFor="last_name">Last Name</label>
            <input id="last_name" type="text" name="last_name" onChange={inputChanged} />
          </p>
          <p>
            <label htmlFor="email">Email</label>
            <input id="email" type="email" name="email" onChange={inputChanged} />
          </p>
          <p>
            <label htmlFor="status">Status</label>
            <select id="status" name="status" onChange={inputChanged}>
              <option value=""></option>
              <option value="Banned">Banned</option>
              <option value="Good">Good</option>
              <option value="Restricted">Restricted</option>
            </select>
          </p>
          <p>
            <label htmlFor="account_type">Account Type</label>
            <select id="account_type" name="account_type" onChange={inputChanged}>
              <option value=""></option>
              <option value="Admin">Admin</option>
              <option value="Blogger">Blogger</option>
              <option value="Commenter">Commenter</option>
              <option value="Moderator">Moderator</option>
            </select>
          </p>
          <p>
            <label htmlFor="created_after">Created Between</label>
            <input id="created_after" type="date" name="created_after" onChange={inputChanged} />
            <span><strong> - </strong></span>
            <input id="created_before" type="date" name="created_before" onChange={inputChanged} />
          </p>
          <button type="submit">Search</button>
        </form>
      </div>
      {
        users.length > 0 &&
        <table className={styles.modTable}>
          <thead>
            <tr>
              <th>Username</th>
              <th>Account Type</th>
              <th>Status</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {
              users.map((user) => (
                <tr key={user._id}>
                  <td>{unescape(user.username)}</td>
                  <td>{user.accountType}</td>
                  <td>{user.status}</td>
                  <td><Link className={styles.detailsLink} to={user.username}><img src={editSvg} alt={`Details for user ${user.username}`} /></Link></td>
                </tr>
              ))
            }
          </tbody>
        </table>
        || <p>There are no users</p>
      }
      {
        lastUrl !== null &&
        lastUrl.searchParams.get('page') !== null &&
        <button onClick={() => {
          const lastPage = lastUrl.searchParams.get('page');

          if (lastPage === '1') {
            lastUrl.searchParams.delete('page');
          } else {
            lastUrl.searchParams.set('page', Number.parseInt(lastPage) - 1);
          }

          fetch(lastUrl, {
            credentials: 'include',
          })
            .then(async (res) => {
              if (res.status === 200) {
                const newUsers = await res.json();
                setLastUrl(new URL(res.url));
                setUsers(newUsers);
              }
            })
        }}>Prev</button>
      }
      {
        users.length >= 20 &&
        <button onClick={(e) => {
          const lastPage = lastUrl.searchParams.get('page');

          if (lastPage === null) {
            lastUrl.searchParams.set('page', 1);
          } else {
            lastUrl.searchParams.set('page', Number.parseInt(lastPage) + 1);
          }

          fetch(lastUrl, {
            credentials: 'include',
          })
            .then(async (res) => {
              if (res.status === 200) {
                const newUsers = await res.json();
                setLastUrl(new URL(res.url));
                setUsers(newUsers);
              }
            })
        }}>Next</button>
      }
      
    </div>
  )
}

function urlReducer(state, action) {
  if (action.type === 'input') {
    if (action.value === '') {
      state.searchParams.delete(action.field);
    } else {
      state.searchParams.set(action.field, action.value);
    }
  }

  console.log(state.toString());
  return state;
}

export default ViewUsers;