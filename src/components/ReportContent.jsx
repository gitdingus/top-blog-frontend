import React, { useContext, useRef, useState } from 'react';
import { UserContext } from '../contexts/UserContext.jsx';
import getLoggedInUser from '../utils/getLoggedInUser.js';
import styles from '../styles/report-content.module.css';
import '../styles/single-column-grid-form.css';

function ReportContent({ contentType, contentId, reportedUser }) {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [ active, setActive ] = useState(false);
  const reasonArea = useRef(null);
  const idString = `report-${contentType}-${contentId}`;

  const reportContent = () => {
    getLoggedInUser()
      .then((userData) => {
        if (currentUser._id !== userData._id) {
          throw new Error("Session Expired");
        }
      })
      .then(() => {
        return fetch(`http://localhost:3000/api/reports`, {
          method: 'post',
          headers: {
            'content-type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            contentType,
            contentId,
            reportedUser,
            reportingUser: currentUser.username,
            reason: reasonArea.current.value,
          })
        })
      })
      .then((res) => {
        if (res.status === 204) {
          alert('Thank you for reporting this issue');
        } else {
          alert('Could not complete your report at this time');
        }
      })
      .catch((err) => {
        setCurrentUser(null);
        alert(`Session expired: please relogin to report ${contentType.toLower()}`);
      })
  }

  if (currentUser !== null) {
    return (
      <div>
        <button onClick={() => setActive(!active)}>Report</button>
        <div className={`form-area single-column-grid-form ${styles.reportForm} ${active ? styles.active : ''}`}>
          <form onSubmit={(e) => {
            e.preventDefault();
            reportContent();
          }}>
            <label htmlFor={idString}>Reason:</label>
            <textarea id={idString} ref={reasonArea}></textarea>
            <button type="submit">{`Report ${contentType}`}</button>
          </form>
        </div>
      </div>
    )
  }
}

export default ReportContent;