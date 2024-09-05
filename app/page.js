
// app/page.js
import React from 'react';

export default async function Home() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
    const res = await fetch(`${apiUrl}/api/posts`, {
      cache: 'no-store',
    });
    if (!res.ok) {
      throw new Error('Failed to fetch');
    }
    const posts = await res.json();

    console.log('Posts:', posts);  // Log the posts data

    return (
      <div>
        <h1>Posts</h1>
        <ul>
          <div >
          {posts.length > 0 ? (
            posts.map(post => (
              <li className=' p-4 border border-black ml-6 mr-8 border-b-zinc-50 ' key={post._id}>{post.name}</li>
            ))
          ) : (
            <li>No posts available</li>
          )}
          </div>
        </ul>
      </div>
    );
  } catch (error) {
    console.error('Error fetching posts:', error);
    return (
      <div>
        <h1>Posts</h1>
        <p>Error fetching posts: {error.message}</p>
      </div>
    );
  }
}