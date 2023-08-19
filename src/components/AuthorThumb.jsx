import React from 'react';
import defaultAuthorImage from '../images/account.png';

function AuthorThumb({ author, className }) {
  return(
    <div className={className}>
      <div className="info">
        {
          (
            author.public && 
            <div>
              <img src={author.image || defaultAuthorImage} alt="author" />
              <p>{author.firstName} {author.lastName}</p>
              <p>{author.email}</p>
              <p>Joined: {new Date(author.accountCreated).toLocaleDateString()}</p>
            </div>
          ) 
          || 
          (
            <div>
              <img src={defaultAuthorImage} alt="author" />
              <p>{author.username}</p>
              <p>Joined: {new Date(author.accountCreated).toLocaleDateString()}</p>
            </div>
          )
        }
      </div>
    </div>
  )
}

export default AuthorThumb;