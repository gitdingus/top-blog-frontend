import React, { useState, useContext } from "react";
import { UserContext } from "../contexts/UserContext.jsx";
import '../styles/single-column-grid-form.css';

function ChangePassword() {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [ errors, setErrors ] = useState({});
  const [ currentPassword, setCurrentPassword] = useState('');
  const [ newPassword, setNewPassword ] = useState('');
  const [ confirmNewPassword, setConfirmNewPassword ] = useState('');
  const [ message, setMessage ] = useState('');

  function clearPasswords() {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
  }

  function changePassword() {
    fetch(`${FETCH_BASE_URL}/users/${currentUser._id}/change-password`, {
      method: 'post',
      credentials: 'include',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        old_password: currentPassword,
        password: newPassword,
        confirm_password: confirmNewPassword,
      }),
    })
      .then(async (res) => {            
        setMessage('');
        setErrors({});
        clearPasswords();

        if (res.status === 204) {
          setMessage('Password changed successfully');
          setErrors({});
        } else if (res.status === 400) {
          const data = await res.json();

          const recievedErrors = data.errors.reduce((errorsObj, error) => {
            const newErrorsObj = { ...errorsObj };

            if (error.type === 'field') {
              newErrorsObj[error.path] = error.msg;
            }

            return newErrorsObj;
          }, {});

          setMessage('');
          setErrors(recievedErrors);
        }
      });
  }
  return (
    <div className="form-area single-column-grid-form">
      <form onSubmit={(e) => {
        e.preventDefault();

        fetch(`${FETCH_BASE_URL}/current-user`, {
          credentials: 'include',
        })
          .then((res) => {
            const notAllowedCodes = [ 401, 403, 404 ];

            if (res.status === 200 || res.status === 400) {
              changePassword();
            } else if (notAllowedCodes.includes(res.status)) {
              clearPasswords();
              setErrors({});
              setMessage('Session expired: Logout and log back in to change password');
              setCurrentUser(null);
            }
          });
        
      }}>
        { message !== '' && <p className="message">{message}</p> }
        <label htmlFor="current-password">Current Password</label>
        <input id="current-password" type="password" value={ currentPassword } onChange={(e) => setCurrentPassword(e.target.value)} />
        { errors.old_password !== undefined && <p className="error">{ errors.old_password }</p>}
        <label htmlFor="new-password">New Password</label>
        <input id="new-password" type="password" value={ newPassword } onChange={(e) => setNewPassword(e.target.value) } />
        { errors.password !== undefined && <p className="error">{ errors.password }</p>}
        <label htmlFor="confirm-new-password">Confirm New Password</label>
        <input id="confirm-new-password" type="password" value={ confirmNewPassword } onChange={(e) => setConfirmNewPassword(e.target.value) }/>
        { errors.confirm_password !== undefined && <p className="error">{ errors.confirm_password }</p>}
        <button type="submit">Change Password</button>
      </form>
    </div>
  )
}

export default ChangePassword;