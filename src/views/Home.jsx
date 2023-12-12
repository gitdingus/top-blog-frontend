import React, { useState, useEffect } from 'react';
import BlogPostThumb from '../components/BlogPostThumb.jsx';
import CategoryButton from '../components/CategoryButton.jsx';

import '../styles/home.css';

function Home() {
  const [ recentPosts, setRecentPosts ] = useState([]);
  const [ categories, setCategories ] = useState([]);

  useEffect(() => {
    fetch(`${FETCH_BASE_URL}/blogs/recent-posts`)
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        }
      })
      .then((data) => {
        setRecentPosts(data.recentPosts);
      });

    fetch(`${FETCH_BASE_URL}/blogs/categories?limit=10`)
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        }
      })
      .then((data) => {
        setCategories(data.categories);
      })
  }, []);

  return (
    <div className="page">
      <section className='recent-posts'>
        <div>
          <h2>Recent blog posts</h2>
          {
            recentPosts.map(post => <BlogPostThumb post={post} key={post._id} />)
          }
        </div>
      </section>
      <section className="categories-section">
        <h2>Discover categories</h2>
        <div className="categories">
          {
            categories.map(category => <CategoryButton category={category} key={category._id} />)
          }
        </div>
        
      </section>
    </div>
  )
}

export default Home;