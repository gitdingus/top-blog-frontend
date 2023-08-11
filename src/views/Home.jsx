import React, { useState, useEffect } from 'react';
import BlogPostThumb from '../components/BlogPostThumb.jsx';
import CategoryButton from '../components/CategoryButton.jsx';
function Home() {
  const [ recentPosts, setRecentPosts ] = useState([]);
  const [ categories, setCategories ] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/blogs/recent-posts')
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        }
      })
      .then((data) => {
        setRecentPosts(data.recentPosts);
      });

    fetch('http://localhost:3000/api/blogs/categories?limit=10')
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
    <div>
      <section>
        <div className='recent-posts'>
          <h2>Recent blog posts</h2>
          {
            recentPosts.map(post => <BlogPostThumb post={post} key={post._id} />)
          }
        </div>
      </section>
      <section>
        <div>
          <h2>Discover categories</h2>
          {
            categories.map(category => <CategoryButton category={category} key={category._id} />)
          }
        </div>
        
      </section>
    </div>
  )
}

export default Home;