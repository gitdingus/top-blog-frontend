import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/UserContext.jsx";

function UpdatePersonalInformation() {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [ message, setMessage ] = useState('');
  const [ firstName, setFirstName ] = useState('');
  const [ lastName, setLastName ] = useState('');
  const [ email, setEmail ] = useState('');
  const [ errors, setErrors ] = useState({});

  useEffect(() => {
    if (currentUser !== null) {
      setFirstName(currentUser.firstName || '');
      setLastName(currentUser.lastName || '');
      setEmail(currentUser.email || '');
    }
  }, [currentUser]);
  
  function clear() {
    setFirstName('');
    setLastName('');
    setEmail('');
    setErrors({});
    setMessage('');
  }

  function updateInformation() {
    const updateObj = {};

    if (firstName !== '') {
      updateObj.first_name = firstName;
    }

    if (lastName !== '') {
      updateObj.last_name = lastName;
    }

    if (email !== '') {
      updateObj.email = email;
    }

    if (Object.keys(updateObj).length === 0) {
      setMessage('Please enter updated information');
      return;
    }

    fetch(`http://localhost:3000/api/users/${currentUser._id}/update`, {
      method: 'post',
      credentials: 'include',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(updateObj),
    })
      .then(async (res) => {
        if (res.status === 404) {
          clear();
          setMessage('Can not update personal information');
        } else {
          const data = await res.json();

          if (res.status === 400) {
            const recievedErrors = data.errors.reduce((errorsObj, error) => {
              const newErrorsObj = { ...errorsObj };

              if (error.type === 'field') {
                newErrorsObj[error.path] = error.msg; 
              }

              return newErrorsObj;
            }, {});

            setErrors(recievedErrors);
          }

          if (res.status === 200) {
            clear();
            setMessage('Personal information successfully updated');
            setCurrentUser(data.user);
          }
        }
      })
  }
  return (
    <div className="form-area single-column-grid-form">
      <form onSubmit={(e) => {
        e.preventDefault();

        fetch('http://localhost:3000/api/current-user', {
          credentials: 'include',
        })
          .then((res) => {
            const notAllowedCodes = [ 401, 403, 404 ];
            
            if (notAllowedCodes.includes(res.status)) {
              clear();
              setMessage('Session expired: Please log out and log back in');
              setCurrentUser(null);
            } else {
              updateInformation();
            }
          })
      }}>
        { message !== '' && <p className="message">{message}</p> }
        <label htmlFor="first-name">First Name</label>
        <input id="first-name" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value) } />
        { errors.first_name !== undefined && <p className="error">{ errors.first_name }</p> }
        <label htmlFor="last-name">Last Name</label>
        <input id="last-name" type="text" value={ lastName } onChange={ (e) => setLastName(e.target.value) } />
        { errors.last_name !== undefined && <p className="error">{ errors.last_name }</p> }
        <label htmlFor="email">Email</label>
        <input id="email" type="text" value={ email } onChange={ (e) => setEmail(e.target.value) } />
        { errors.email !== undefined && <p className="error">{ errors.email }</p> }
        <button type="submit">Update Information</button>
      </form>  
    </div>
  )
}

export default UpdatePersonalInformation;