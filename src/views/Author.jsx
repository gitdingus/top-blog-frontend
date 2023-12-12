import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BlogThumb from '../components/BlogThumb.jsx';
import defaultAuthorImage from '../images/account.png';
import imageStyles from '../styles/images.module.css';

function Author() {
  const params = useParams();
  const [ author, setAuthor ] = useState(null);
  const [ blogs, setBlogs ] = useState(null);
  useEffect(() => {
    if (!params.username) return;

    fetch(`${FETCH_BASE_URL}/blogs/authors/${params.username}`)
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        }
      })
      .then((data) => {
        setAuthor(data.author);
      });
  }, []);

  useEffect(() => {
    if (author === null) return;

    fetch(`${FETCH_BASE_URL}/blogs?owner=${author.username}&preview=true`)
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        }
      })
      .then((data) => {
        setBlogs(data.blogs);
      })
  }, [ author ]);
  if (author === null) {
    return <div>Loading author</div>
  }

  if (author.status === 'Banned') {
    return <div>This account has been banned</div>;
  }

  if (['Good', 'Restricted'].includes(author.status)) {
    return (
      <div className="author">
        <div className="info">
          <div>
            <img className={imageStyles.profileImage} src={author.image || defaultAuthorImage} alt="author" />
            {
              author.public &&
              (
                <>
                  <p>{author.firstName} {author.lastName}</p>
                  <p>{author.email}</p>
                </>
              ) ||
              <p>{author.username}</p>
            }
            <p>Joined: {new Date(author.accountCreated).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="blog-list">
          {
            blogs !== null &&
            <div>
              {
                blogs.map((blog) => 
                  <BlogThumb blog={blog} key={blog._id} />
                )
              }
            </div>
          }
        </div>
      </div>
    )
  }
}

export default Author;