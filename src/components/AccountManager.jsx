import React, { useContext, useRef, useState } from 'react'
import { Link } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext.jsx';
import closeSvg from '../images/close.svg';
import '../styles/account-manager.css';
import '../styles/single-column-grid-form.css'

function AccountManager() {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [ loginError, setLoginError ] = useState('');
  const [ createAccountErrors, setCreateAccountErrors ] = useState({});
  const [ showSignInModal, setShowSignInModal ] = useState(false);
  const [ showCreateAccountModal, setShowCreateAccountModal ] = useState(false);
  const loginUsername = useRef(null);
  const loginPassword = useRef(null);
  const createAccountUsername = useRef(null);
  const createAccountPassword = useRef(null);
  const createAccountConfirmPassword = useRef(null);
  const createAccountEmail = useRef(null);
  const createAccountFirstName = useRef(null);
  const createAccountLastName = useRef(null);
  const createAccountType = useRef(null);

  if (currentUser === null) { // Give ability to login
    return (
      <div id="account-manager">
        <div id="sign-in-modal" className={`${showSignInModal ? 'expanded' : ''}`}>
          <div id="sign-in-form">
            <div className="top-bar">
              <p>Login</p>
              <button className="close-button" onClick={() => {
                setShowSignInModal(false);
              }}>
                <img src={closeSvg} alt="close sign in modal" />
              </button>
            </ div>
            <div className="form-area single-column-grid-form">
              <form onSubmit={
                (e) => {
                  e.preventDefault();

                  fetch('http://localhost:3000/api/login', {
                    method: 'post',
                    headers: {
                      'content-type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                      username: loginUsername.current.value,
                      password: loginPassword.current.value,
                    }),
                  })
                    .then((res) => {
                      if (res.status === 401 || res.status === 400) {
                        throw new Error('Invalid username or password');
                      } else if (res.status === 200) {
                        return res.json();
                      }
                    })
                    .then((json) => {
                      setLoginError('');
                      setShowSignInModal(false);
                      setCurrentUser(json.user);
                    })
                    .catch((error) => {
                      setLoginError(error.message);
                    });
                }
              }>
                <label htmlFor="username">Username</label>
                <input id="username" ref={loginUsername} type="text" />
                <label htmlFor="password">Password</label>
                <input id="password" ref={loginPassword} type="password" />
                <p className="error">{loginError}</p>
                <button type="submit">Log in</button>
              </form>
            </div>
          </div>
        </div>
        <div id="create-account-modal" className={`${showCreateAccountModal ? 'expanded': ''}`}>
          <div id="create-account-form">
            <div className="top-bar">
              <p>Create Account</p>
              <button className="close-button" onClick={() => {
                setShowCreateAccountModal(false);
              }}>
                <img src={closeSvg} alt="close sign in modal" />
              </button>
            </div>
            <div className="form-area single-column-grid-form">
              <form onSubmit={
                (e) => {
                  e.preventDefault();

                  fetch('http://localhost:3000/api/create-account', {
                    method: 'post',
                    headers: {
                      'content-type': 'application/json',
                    },
                    body: JSON.stringify({
                      //username, password, confirm_password, first_name, last_name, account_type, email
                      username: createAccountUsername.current.value,
                      password: createAccountPassword.current.value,
                      confirm_password: createAccountConfirmPassword.current.value,
                      first_name: createAccountFirstName.current.value,
                      last_name: createAccountLastName.current.value,
                      email: createAccountEmail.current.value,
                      account_type: createAccountType.current.value,
                    }),
                  })
                    .then(async (res) => {
                      const data = await res.json();
                      console.log(data);
                      if (res.status === 400) {
                        const errorsObj = data.errors.reduce((errorObj, error) => {
                          const newErrorObj = { ...errorObj };
                          if (error.type === 'field') {
                            newErrorObj[error.path] = error.msg;
                          }  
                          return newErrorObj;
                        }, {});
                        setCreateAccountErrors(errorsObj);
                      } else if (res.status === 200) {
                        setCreateAccountErrors({});
                        setShowCreateAccountModal(false);
                        fetch('http://localhost:3000/api/login', {
                          method: 'post',
                          credentials: 'include',
                          headers: {
                            'content-type': 'application/json',
                          },
                          body: JSON.stringify({
                            username: createAccountUsername.current.value,
                            password: createAccountPassword.current.value,
                          }),
                        })
                          .then((res) => {
                            if (res.status === 200) {
                              return res.json();
                            } else if (res.status === 401) {
                              throw new Error('There has been a problem logging in');
                            }
                          })
                          .then((data) => {
                            setCurrentUser(data.user);
                          })
                          .catch((error) => {
                            console.log(error.message);
                          });
                      }
                    })
                }
              }>
                <label htmlFor="create-account-username">Username</label>
                <input id="create-account-username" ref={createAccountUsername} type="text" />
                { createAccountErrors.username !== undefined && <p className="error">{createAccountErrors.username}</p> }
                <label htmlFor="create-account-password">Password</label>
                <input id="create-account-password" ref={createAccountPassword} type="password" />
                { createAccountErrors.password !== undefined && <p className="error">{createAccountErrors.password}</p> }
                <label htmlFor="create-account-confirm-password">Confirm Password</label>
                <input id="create-account-confirm-password" ref={createAccountConfirmPassword} type="password" />
                { createAccountErrors.confirm_password !== undefined && <p className="error">{createAccountErrors.confirm_password}</p> }
                <label htmlFor="create-account-first-name">First Name</label>
                <input id="create-account-first-name" ref={createAccountFirstName} type="text" />
                { createAccountErrors.first_name !== undefined && <p className="error">{createAccountErrors.first_name}</p> }
                <label htmlFor="create-account-last-name">Last Name</label>
                <input id="create-account-last-name" ref={createAccountLastName} type="text" />
                { createAccountErrors.last_name !== undefined && <p className="error">{createAccountErrors.last_name}</p> }
                <label htmlFor="create-account-email">Email</label>
                <input id="create-account-email" ref={createAccountEmail} type="text" />
                { createAccountErrors.email !== undefined && <p className="error">{createAccountErrors.email}</p> }
                <label htmlFor="create-account-type">Account Type</label>
                <select id="create-account-type" ref={createAccountType}>
                  <option value="Blogger">Blogger</option>
                  <option value="Commenter">Commenter</option>
                </select>
                { createAccountErrors.account_type !== undefined && <p className="error">{createAccountErrors.account_type}</p> }
                <button type="submit">Create Account</button>
              </form>
            </div>
          </div>
        </div>
        <div className="buttons">
          <button id="sign-in"
            onClick={() => {
              setShowSignInModal(!showSignInModal);
            }}>Log in
          </button>
          <button id="create-account"
            onClick={() => {
              setShowCreateAccountModal(!showCreateAccountModal);
            }}>Create Account
          </button>
        </div>
      </div>
    )
  } else if (typeof currentUser === 'object') { // User is logged
    return (
      <div className="account-manager">
        <p>Welcome { (currentUser.firstName && currentUser.lastName && `${currentUser.firstName} ${currentUser.lastName}`) || `${currentUser.username}`}</p>
        <Link to="preferences">Manage Preferences</Link>
        <button onClick={() => {
          fetch('http://localhost:3000/api/logout', {
            method: 'post',
            credentials: 'include',
          })
            .then((res) => {
              if (res.status === 200) {
                setCurrentUser(null);
              }
            });
        }}>Log out</button>
      </div>
    )
  }
}

export default AccountManager;