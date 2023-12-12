import React, { useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { unescape } from 'validator';
import { UserContext } from '../contexts/UserContext.jsx';
import ReportContent from './ReportContent.jsx';
import getLoggedInUser from '../utils/getLoggedInUser';
import createErrorObject from '../utils/createErrorObject.js';
import styles from '../styles/comment-area.module.css';

function CommentArea() {
  const params = useParams();
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [ comments, setComments ] = useState([]);
  const [ comment, setComment ] = useState('Leave Comment');
  const [ message, setMessage ] = useState('');
  const [ errors, setErrors ] = useState({});

  useEffect(() => {
    getComments();
  }, []);

  function getComments() {
    fetch(`${FETCH_BASE_URL}/blogs/post/${params.postId}/comments`)
      .then(async(res) => {
        if (res.status === 200) {
          const data = await res.json();

          setComments(data.comments);
        }
    });
  }
  // /api/users/:userId/blogs/post/:postId/create-comment
  function postComment() {
    fetch(`${FETCH_BASE_URL}/users/${currentUser._id}/blogs/post/${params.postId}/create-comment`, {
      method: 'post',
      credentials: 'include',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        content: comment,
      }),
    })
      .then(async (res) => {
        const badResponses = [ 401, 403 ];
        if (res.status === 400) {
          const data = await res.json();

          setErrors(createErrorObject(data.errors));
          return;
        } else if (badResponses.includes(res.status)) {
          throw new Error("Not allowed");
          return;
        }

        setComment('');
        setMessage('');
        setErrors({});
        getComments();
      })
      .catch((err) => {
        setMessage('Not allowed');
      });
  }

  return (
    <div>
      <div className={`${styles.commentForm} form-area single-column-grid-form`}>
        <form onSubmit={(e) => {
          e.preventDefault();

          if (comment === 'Leave Comment') {
            setMessage('Must enter a message if you wish to post');
            return;
          }

          getLoggedInUser()
            .then((userData) => {
              if (userData._id === currentUser._id) {
                postComment();
              }
            })
            .catch((err) => {
              setMessage('Must log in to post comment');
            });
        }}>
          { message !== '' && <p className="message">{message}</p> }
          <h2>Leave Comment</h2>
          <textarea value={comment} 
            onClick={(e) => {
              if ( comment === "Leave Comment" ) {
                setComment('');
              }
            }}
            onChange={(e) => {
              setComment(e.target.value);
            }}
          />
          { errors.content !== undefined && <p className="error">{errors.content}</p> }
          <button type="submit">Submit</button>
        </form>
      </div>
      <div className={styles.comments}>
        <h2>Comments</h2>
        {
          comments.length > 0 &&
          comments.map((comment) => {
            return (
              <div className="comment" key={comment._id}>
                {
                  comment.author.doc.firstName && comment.author.doc.lastName && <p>{`${unescape(comment.author.doc.firstName)} ${unescape(comment.author.doc.lastName)}`}</p>
                  || 
                  <p>{unescape(comment.author.doc.username)}</p>
                }
                <p>{new Date(comment.created).toLocaleString()}</p>
                <p>{unescape(comment.content)}</p>
                <ReportContent contentType="Comment" contentId={comment._id} reportedUser={comment.author.doc.username} />
              </div>
            )
          })
          || 
          <p>There are no comments at this time</p>

        }
      </div>
    </div>
  );
}

export default CommentArea;

