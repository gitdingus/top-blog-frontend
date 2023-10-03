import React, { useContext, useEffect, useReducer, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { unescape } from 'validator';
import { UserContext } from '../contexts/UserContext.jsx';

function ViewUser() {
  const { username } = useParams();
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [ user, setUser ] = useState(null);
  const [ updateUrl, dispatchUpdateUrl ] = useReducer(updateReducer, new URL('http://localhost:3000/api/moderation/users/'));
  const allowedAccountTypes = [ 'Admin', 'Moderator' ];

  useEffect(() => {
    if (currentUser === null) {
      return;
    }

    if (!allowedAccountTypes.includes(currentUser.accountType)) {
      return;
    }

    fetch(`http://localhost:3000/api/moderation/users?username=${username}`, {
      credentials: 'include',
    })
      .then(async (res) => {
        if (res.status === 200) {
          const data = await res.json();
          dispatchUpdateUrl({
            type: 'user-set',
            id: data[0]._id,
          });
          setUser(data[0]);
        }
      });

  }, []);

  if (currentUser === null || !allowedAccountTypes.includes(currentUser.accountType)) {
    return <div>Access Denied</div>
  }

  if (user === null) {
    return <div>User not found</div>
  }

  const selectChanged = (e) => {
    dispatchUpdateUrl({
      type: 'select-changed',
      field: e.target.name,
      value: e.target.value,
    });
  }

  const deleteUserChanged = (e) => {
    dispatchUpdateUrl({
      type: 'delete-user',
      field: e.target.name,
      value: e.target.checked,
    });
  }
  return (
    <div>
      <p>Username: {unescape(user.username)}</p>
      {
        user.email !== undefined && 
        <p>Email: {unescape(user.email)}</p>
      }
      {
        user.firstName !== undefined && user.lastName !== undefined &&
        <p>Name: {`${unescape(user.firstName)} ${unescape(user.lastName)}`}</p>
      }
      <form onSubmit={(e) => {
        e.preventDefault();
        
        let proceed = true;
        if (updateUrl.searchParams.get('delete_user') === 'true') {
          proceed = confirm('You are about to delete a user and all associated content. This can not be undone. Do you wish to proceed?');
        }

        if (!proceed) {
          return;
        }

        fetch(updateUrl, {
          method: 'post',
          credentials: 'include',
        })
          .then((res) => {
            console.log(res.status);
          })
      }}>
        <p>
          <label htmlFor="account_status">Account Status</label>
          <select id="account_status" name="account_status" defaultValue={user.status} onChange={ selectChanged }>
            <option value=""></option>
            <option value="Banned">Banned</option>
            <option value="Good">Good</option>
            <option value="Restricted">Restricted</option>
          </select>
        </p>
        <p>
          <label htmlFor="account_type">Account Type</label>
          <select id="account_type" name="account_type" defaultValue={user.accountType} onChange={ selectChanged }>
            <option value=""></option>
            <option value="Admin">Admin</option>
            <option value="Blogger">Blogger</option>
            <option value="Commenter">Commenter</option>
            <option value="Moderator">Moderator</option>
          </select>
        </p>
        <p>
          <label htmlFor="delete_user">Delete user and all associated content</label>
          <input id="delete_user" name="delete_user" type="checkbox" onChange={deleteUserChanged} />
        </p>
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}

function updateReducer(state, action) {
  
  if (action.type === 'user-set') {
    return new URL(action.id, state);
  }

  if (action.type === "select-changed") {
    if (action.value === '') {
      state.searchParams.delete(action.field);
    } else {
      state.searchParams.set(action.field, action.value);
    }
  }

  if (action.type === 'delete-user') {
    if (action.value === false) {
      state.searchParams.delete(action.field);
    } else {
      state.searchParams.set(action.field, action.value);
    }
  }

  return new URL(state);
}
export default ViewUser;