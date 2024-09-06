
// app/page.js
"use client"; // Add this directive to use client-side features

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter for navigation

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
  const router = useRouter(); // Initialize the router

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

  const handleNavigate = () => {
    router.push('/add-posts'); // Navigate to the 'add-post' page
  };

  return (
    <div className='min-h-screen flex flex-col items-center'>
      <h1 className='text-2xl font-bold mb-4 text-center w-full'>
        Posts
      </h1>

      <div className='mb-4'>
        <button className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700' onClick={handleNavigate}>
          Add Post
        </button>
      </div>

      <div className='w-full max-w-3xl px-4'>
        {error ? (
          <p className='text-red-500'>Error fetching posts: {error}</p>
        ) : (
          <ul className='border border-black'>
            {posts.length > 0 ? (
              posts.map(post => (
                <li className='p-4 border-b border-black' key={post._id}>
                  {post.name}
                </li>
              ))
            ) : (
              <li className='p-4'>No posts available</li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}



///