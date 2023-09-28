import React, { useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { unescape } from 'validator';
import getLoggedInUser from '../utils/getLoggedInUser.js';
import { UserContext } from '../contexts/UserContext.jsx';
import styles from '../styles/view-report.module.css';
import '../styles/single-column-grid-form.css';
function ViewReport() {
  const { reportId } = useParams();
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [ report, setReport ] = useState(null);
  const [ content, setContent ] = useState(null);
  const modAction = useRef(null);

  useEffect(() => {
    getLoggedInUser()
      .then((userData) => {
        if (userData._id !== currentUser._id) {
          throw new Error('Session Expired');
        }

        return fetch(`http://localhost:3000/api/reports/${reportId}`, {
          credentials: 'include',
        });
      })
      .then(async (res) => {
        if (res.status === 200) {
          const data = await res.json();
          setReport(data.report);
          setContent(null);
        }
      })
      .catch((err) => {
        if (err.message === 'Session Expired') {
          setCurrentUser(null);
        }
      });
  }, [reportId]);

  useEffect(() => {
    if (report === null) {
      return;
    }

    fetch(`http://localhost:3000/api/moderation/${report.contentType}/${report.contentId}`, {
      credentials: 'include',
    })
      .then(async (res) => {
        if (res.status === 200) {
          const data = await res.json();
          setContent(data);
        }

      })
  }, [report]);

  if (report === null) {
    return;
  }

  const takeAction = () => {
    getLoggedInUser()
      .then((userData) => {
        if (userData._id !== currentUser._id) {
          throw new Error('Session Expired');
        }

        return fetch(`http://localhost:3000/api/moderation/content?action=${modAction.current.value}`, {
          method: 'post',
          credentials: 'include',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            reportId,
          }),
        });
      })
      .then(async (res) => {
        console.log('recieved response', res.status);
        if (res.status === 200) {
          console.log(await res.json());
        }
      })
      .catch((err) => {
        if (err.message === 'Session Expired') {
          setCurrentUser(null);
        }
      })
  }
  return (
    <div className={styles.report}>
      <h1>Report</h1>
      <div className={styles.info}>
        <div className="user-generated-info">
          <p>Type: {report.contentType}</p>
          <p>Reporting User: {report.reportingUser}</p>
          <p>Reported User: {report.reportedUser}</p>
          <p>Reported on { new Date(report.reportCreated).toLocaleString()}</p>
          <p>Reason for report: {unescape(report.reason)}</p>
        </div>
        {  
          report.actionTaken !== undefined 
          &&      
          <div className="mod">
            <p>Responding Moderator: {report.respondingModerator || "(None)"}</p>
            <p>Action Taken: {report.actionTaken || "(None)"}</p>
            <p>Date of Action: {report.dateOfAction || "(None)"}</p>
            {/* checked={report.settled !== undefined ? report.settled : false  */}
            <p>Settled: <input type="checkbox" readOnly checked={report.settled !== undefined ? report.settled : false } /></p>
          </div>
          ||
          <div className="mod form-area single-column-grid-form">
            <form onSubmit={(e) => {
              e.preventDefault();
              takeAction();
            }}>
              <label htmlFor="mod-actions">Mod Action</label>
              <select id="mod-actions" ref={modAction} defaultValue="select">
                <option value="select" disabled>Select Action...</option>
                <option value="delete">Delete Content</option>
                <option value="restrict">Restrict User</option>
                <option value="ban">Ban User</option>
              </select>
              <button type="submit">Complete Action</button>
            </form>
          </div>
        }
      </div>
      <div className={styles.content}>
        <h2>Content</h2>
        { 
          content !== null 
          && content.contentType === 'BlogPost' 
          && <h3>{unescape(content.content.title)}</h3> 
          || <h3>Comment</h3>
        }
        {
          content !== null 
          && <p>{unescape(content.content.content)}</p>
        }
        {
          content === null
          && <p>Content not found</p>
        }
      </div>
    </div>
  )
}

export default ViewReport;