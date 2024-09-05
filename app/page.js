
// app/page.js
// app/page.js
"use client"; // Add this directive to use client-side features

import React, { useState, useEffect } from 'react';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/posts`, {
          cache: 'no-store',
        });

        if (!res.ok) {
          throw new Error('Failed to fetch');
        }

        const data = await res.json();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setError(error.message);
      }
    };

    fetchPosts();
  }, [apiUrl]);

  return (
    <div>
      <h1>Posts</h1>
      {error ? (
        <p>Error fetching posts: {error}</p>
      ) : (
        <ul>
          {posts.length > 0 ? (
            posts.map(post => (
              <li className='p-4 border border-black ml-6 mr-8 border-b-zinc-50' key={post._id}>
                {post.name}
              </li>
            ))
          ) : (
            <li>No posts available</li>
          )}
        </ul>
      )}
    </div>
  );
}


//