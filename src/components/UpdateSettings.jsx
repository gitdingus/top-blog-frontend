import React, { useEffect, useContext, useState } from "react";
import { UserContext } from '../contexts/UserContext.jsx';
import '../styles/single-column-grid-form.css';

function UpdateSettings() {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [ message, setMessage ] = useState('');
  const [ errors, setErrors ] = useState({});
  const [ publicProfile, setPublicProfile ] = useState(false);

  useEffect(() => {
    if (currentUser !== null) {
      if (currentUser.public === true) {
        setPublicProfile(true);
      } else {
        setPublicProfile(false);
      }
    }
  }, [currentUser]);

  function updateSettings() {
    fetch(`${FETCH_BASE_URL}/users/${currentUser._id}/update-settings`, {
      method: 'post',
      credentials: 'include',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        public: publicProfile,
      }),
    })
      .then(async (res) => {
        if (res.status === 401 || res.status === 403) {
          setMessage('Must log out and log back in to update settings');
        } else { 
          if (res.status === 400) {
            const data = await res.json()
            const recievedErrors = data.errors.reduce((errorsObj, error) => {
              const newErrorsObj = { ...errorsObj };

              if (error.type === 'field') {
                newErrorsObj[error.path] = error.msg;
              }

              return newErrorsObj;
            }, {});

            setErrors(recievedErrors);
          } else if (res.status === 204) {
            setMessage('Settings updated successfully');
            setErrors({});
          }
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
            const badResponses = [ 401, 403, 404 ];

            if (badResponses.includes(res.status)) {
              setMessage('Session expired: Please log back in to update settings');
              setCurrentUser(null);
            } else {
              updateSettings();
            }
          })
      }}>
        { message !== '' && <p className={message}>{message}</p>}
        <div className="checkbox-field">
          <label htmlFor="public-setting">Public Profile</label>
          <input id="public-setting" type="checkbox" checked={publicProfile} onChange={(e) => setPublicProfile(e.target.checked)} />
        </div>
        { errors.public !== undefined && <p className="error">{errors.public}</p>}
        <button type="submit">Change settings</button>
      </form>
    </div>
  )
}

export default UpdateSettings;