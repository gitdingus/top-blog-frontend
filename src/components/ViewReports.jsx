import React, { useContext, useEffect, useReducer, useState } from 'react';
import { Link, Outlet, useParams } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext.jsx';
import getLoggedInUser from '../utils/getLoggedInUser.js';
import detailsSvg from '../images/clipboard-edit.svg';
import styles from '../styles/mod-table.module.css';

function ViewReports() {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [ searchUrl, dispatchSearchUrl ] = useReducer(urlReducer, new URL('http://localhost:3000/api/reports?settled=false'));
  const { reportId } = useParams();
  const [ reports, setReports ] = useState([]);
  const [ lastUrl, setLastUrl ] = useState(null);

  useEffect(() => {
    if (currentUser === null) {
      return;
    }

    getLoggedInUser()
      .then((userData) => {
        if (currentUser._id !== userData._id){
          throw new Error("Session Expired");
        }

        const allowedAccountTypes = ['Admin', 'Moderator'];

        if (!allowedAccountTypes.includes(userData.accountType)) {
          throw new Error('Access denied');
        }

        return fetch(searchUrl, {
          credentials: 'include',
        });
      })
      .then(async(res) => {
        if (res.status === 200) {
          const data = await res.json();
          setReports(data);
          setLastUrl(new URL(res.url));
        }
      })
      .catch((err) => {
        if (err.message === "Session Expired") {
          setCurrentUser(null);
        }
        console.log(err);
      });
  }, [currentUser]);

  const checkboxChanged = (e) => {
    dispatchSearchUrl({
      input: 'checkbox', 
      field: e.target.name,
      type: e.target.value,
      checked: e.target.checked,
    });
  }

  const textboxChanged = (e) => {
    dispatchSearchUrl({
      input: 'textbox',
      field: e.target.name,
      value: e.target.value,
    });
  }

  const dateChanged = (e) => {
    dispatchSearchUrl({
      input: 'date',
      field: e.target.name,
      value: e.target.value,
    });
  }
  return (
    <div>
      <div className={styles.searchBy}>
        <form onSubmit={(e) => {
          e.preventDefault();

          fetch(searchUrl, {
            credentials: 'include',
          })
            .then(async (res) => {
              if(res.status === 200) {
                setLastUrl(new URL(res.url));
                setReports(await res.json());
              }
            })
        }}>
          <fieldset>
            <legend>
              Content Type
            </legend>
            <p>
              <input id="comment-checkbox" type="checkbox" name="contentType" value="Comment" onChange={(e) => {
                checkboxChanged(e);
              }}/>
              <label htmlFor="comment-checkbox">Comment</label>
            </p>
            <p>
              <input id="blogpost-checkbox" type="checkbox" name="contentType" value="BlogPost" onChange={(e) => {
                checkboxChanged(e);
              }} />
              <label htmlFor="blogpost-checkbox">Blog Post</label>
            </p>
          </fieldset>
          <fieldset>
            <legend>Settled</legend>
            <p>
              <input id="settled-checkbox" type="checkbox" name="settled" value="true" onChange={(e) => {
                checkboxChanged(e);
              }}/>
              <label htmlFor="settled-checkbox">Settled</label>
            </p>
            <p>
              <input id="unsettled-checkbox" type="checkbox" name="settled" value="false" onChange={(e) => {
                checkboxChanged(e);
              }} defaultChecked={!!searchUrl.searchParams.get('settled')}/>
              <label htmlFor="unsettled-checkbox">Not settled</label>
            </p>
          </fieldset>
          <fieldset>
            <legend>Action Taken</legend>
            <p>
              <input id="banned-checkbox" type="checkbox" name="actionTaken" value="Banned" onChange={(e) => {
                checkboxChanged(e);
              }} />
              <label htmlFor="banned-checkbox">Banned</label>
            </p>
            <p>
              <input id="restricted-checkbox" type="checkbox" name="actionTaken" value="Restricted" onChange={(e) => {
                checkboxChanged(e);
              }} />
              <label htmlFor="restricted-checkbox">Restricted</label>
            </p>
            <p>
              <input id="deleted-checkbox" type="checkbox" name="actionTaken" value="Delete" onChange={(e) => {
                checkboxChanged(e);
              }}/>
              <label htmlFor="deleted-checkbox">Deleted</label>
            </p>
          </fieldset>
          <p>
            <label htmlFor="reported-user-input">Reported User</label>
            <input id="reported-user-input" type="text" name="reportedUser" onChange={(e) => {
              textboxChanged(e);
            }}/>
          </p>
          <p>
            <label htmlFor="reporting-user-input">Reporting User</label>
            <input id="reporting-user-input" type="text" name="reportingUser" onChange={(e) => {
              textboxChanged(e);
            }}/>
          </p>
          <p>
            <label htmlFor="responding-mod-input">Responding Mod</label>
            <input id="responding-mod-input" type="text" name="respondingModerator" onChange={(e) => {
              textboxChanged(e);
            }}/>
          </p>
          <p>
            <label htmlFor="reported-date-begin-input">Reported on</label>
            <input id="reported-date-begin-input" type="date" name="reportedAfter" onChange={(e) => {
              dateChanged(e);
            }} />
            <label htmlFor="reported-date-through-input"><strong> - </strong></label>
            <input id="reported-date-end-input" type="date" name="reportedBefore" onChange={(e) => {
              dateChanged(e);
            }} />
          </p>
          <p>
            <label htmlFor="responded-date-begin-input">Responded on</label>
            <input id="responded-date-begin-input" type="date" name="respondedAfter" onChange={(e) => {
              dateChanged(e);
            }}/>
            <label htmlFor="responded-date-through-input"><strong> - </strong></label>
            <input id="responded-date-end-input" type="date" name="respondedBefore" onChange={(e) => {
              dateChanged(e);
            }} />
          </p>
          <button type="submit">Search</button>
        </form>
      </div>
      { 
        reports.length > 0 &&
        <div className={styles.reports}>
          <table className={styles.modTable}>
            <thead>
              <tr>
                <th>Content Type</th>
                <th>Reported User</th>
                <th>Reporting User</th>
                <th>Date Reported</th>
                <th>Settled</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {
                reports.map((report) => {
                  return (
                    <tr key={report._id} className={(reportId === report._id) ? styles.active : ''}>
                      <td>{report.contentType}</td>
                      <td>{report.reportedUser}</td>
                      <td>{report.reportingUser}</td>
                      <td>{new Date(report.reportCreated).toLocaleString()}</td>
                      <td><input type="checkbox" checked={report.settled || false} readOnly /></td>
                      <td><Link className={styles.detailsLink} to={report._id}><img src={detailsSvg} alt="view report details" /></Link></td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
        </div>
        ||
        <p>There are no reports to display</p>
      }
      {
        lastUrl !== null &&
        lastUrl.searchParams.get('page') !== null &&
        <button type="button" onClick={() => {
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
                const reports = await res.json();
                setLastUrl(new URL(res.url));
                setReports(reports);
              }
            });
        }}>
          Prev
        </button>
      }
      {
        reports.length >= 20 &&
        <button type="button" onClick={() => {
          const lastPage = lastUrl.searchParams.get('page');

          if (lastPage !== null) {
            lastUrl.searchParams.set('page', Number.parseInt(lastPage) + 1);
          } else {
            lastUrl.searchParams.set('page', 1);
          }

          fetch(lastUrl, {
            credentials: 'include',
          })
            .then(async (res) => {
              if (res.status === 200) {
                const reports = await res.json();
                setLastUrl(new URL(res.url));
                setReports(reports);
              }
            });
        }}>
          Next
        </button>
      }
      <Outlet />
    </div>
  )
}

function urlReducer(state, action) {
  const searchParams = state.searchParams;
  if (action.input === 'checkbox') {
    if (searchParams.has(action.field, action.type)) {
      if (action.checked === false) {
        searchParams.delete(action.field, action.type);
      }
    } else {
      if (action.checked === true) {
        searchParams.append(action.field, action.type);
      }
    }
  }

  if (action.input === 'textbox') {
    if (action.value === '') {
      searchParams.delete(action.field);
    } else {
      searchParams.set(action.field, action.value);
    }
  }

  if (action.input === 'date') {
    if (action.value === '') {
      searchParams.delete(action.field);
    } else {
      searchParams.set(action.field, action.value);
    }
  }
  return state;
}
export default ViewReports;