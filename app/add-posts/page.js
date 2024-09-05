
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddPost() {
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, content }),
      });

      if (res.ok) {
        setSuccess('Post added successfully!');
        setName('');
        setContent('');
        router.push('/');
      } else {
        const data = await res.json();
        setError(data.error || 'Something went wrong');
      }
    } catch (err) {
      setError('Failed to add post');
    }
  };

  return (
    <div>
      <h1>Add a New Post</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Post Title</label>
          <input className=' text-black'
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        {/* <div>
          <label htmlFor="content">Content</label>
          <textarea className=' text-black'
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
        </div> */}
        <button type="submit">Add Post</button>
      </form>
    </div>
  );
}