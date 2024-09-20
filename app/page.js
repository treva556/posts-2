// app/page.js
"use client"; // Ensure this is included for Client Component

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('');
  const [showCommentBox, setShowCommentBox] = useState({}); // Track visibility of comment boxes per post
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
  const router = useRouter();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/posts`, {
          cache: 'force-cache', // Cache the response or revalidate
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

  const handleCommentSubmit = async (postId) => {
    try {
      const res = await fetch(`${apiUrl}/api/posts/${postId}/comments`, {
        method: 'POST',
        body: JSON.stringify({ text: newComment, author: commentAuthor }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        throw new Error('Failed to add comment');
      }

      setPosts(prevPosts =>
        prevPosts.map(post =>
          post._id === postId
            ? { ...post, comments: [...(post.comments || []), { text: newComment, createdAt: new Date(), author: commentAuthor }] }
            : post
        )
      );

      setNewComment('');
      setCommentAuthor('');
    } catch (error) {
      console.error('Error adding comment:', error);
      setError(error.message);
    }
  };

  const handleDelete = async (postId) => {
    try {
      const res = await fetch(`${apiUrl}/api/posts/${postId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete post');
      }

      setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
      setError(error.message);
    }
  };

  const toggleCommentBox = (postId) => {
    setShowCommentBox(prevState => ({
      ...prevState,
      [postId]: !prevState[postId], // Toggle the visibility of the comment box for the specific post
    }));
  };

  return (
    <div className='min-h-screen flex flex-col items-center'>
      <h1 className='text-2xl font-bold mb-4 text-center w-full'>
        Posts
      </h1>

      <div className='mb-4'>
        <button className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700' onClick={() => router.push('/posts/add-posts')}>
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
                <li className='p-4 border-b-white  border-black' key={post._id}>
                  <div className='flex justify-between'>
                    <span className='text-xl'>{post.name}</span>
                    <button
                      onClick={() => handleDelete(post._id)}
                      className='px-2 py-1 bg-red-500 text-white rounded hover:bg-red-700'
                    >
                      Delete
                    </button>
                  </div>
                  <div className='mt-4'>
                    <h2 className='text-sm font-semibold'>Comments</h2>
                    <ul className='mt-2'>
                      {(post.comments || []).map((comment, index) => (
                        <li key={index} className='p-2 border-t'>
                          <strong>{comment.author}</strong>: {comment.text} <br />
                          <small>{new Date(comment.createdAt).toLocaleString()}</small>
                        </li>
                      ))}
                    </ul>
                    
                    <button
                      className='mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700'
                      onClick={() => toggleCommentBox(post._id)}
                    >
                      {showCommentBox[post._id] ? 'Hide Comment Box' : 'Comment'}
                    </button>

                    {showCommentBox[post._id] && (
                      <div className='mt-2'>
                        <textarea
                          className='w-full mt-2 text-black border border-gray-300 rounded'
                          placeholder='Add a comment...'
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                        />
                        {/* <input
                          className='w-full mt-2 p-2 border border-gray-300 rounded'
                          placeholder='Your name...'
                          value={commentAuthor}
                          onChange={(e) => setCommentAuthor(e.target.value)}
                        /> */}
                        <button
                          className='mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700'
                          onClick={() => handleCommentSubmit(post._id)}
                        >
                          Add Comment
                        </button>
                      </div>
                    )}
                  </div>
                </li>
              ))
            ) : (
              <li className='p-4'>Loading...</li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}


// // app/page.js

// "use client"; // Add this directive to use client-side features

// import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation'; // Import useRouter for navigation

// export default function Home() {
//   const [posts, setPosts] = useState([]);
//   const [error, setError] = useState(null);
//   const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
//   const router = useRouter(); // Initialize the router

//   useEffect(() => {
//     const fetchPosts = async () => {
//       try {
//         const res = await fetch(`${apiUrl}/api/posts`, {
//           cache: 'no-store',
//         });

//         if (!res.ok) {
//           throw new Error('Failed to fetch');
//         }

//         const data = await res.json();
//         setPosts(data);
//       } catch (error) {
//         console.error('Error fetching posts:', error);
//         setError(error.message);
//       }
//     };

//     fetchPosts();
//   }, [apiUrl]);

//   // Handle post deletion
//   const handleDelete = async (postId) => {
//     try {
//       const res = await fetch(`${apiUrl}/api/posts/${postId}`, {
//         method: 'DELETE',
//       });
  
//       if (!res.ok) {
//         throw new Error('Failed to delete post');
//       }
  
//       setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
//     } catch (error) {
//       console.error('Error deleting post:', error);
//       setError(error.message);
//     }
//   };

//   const handleNavigate = () => {
//     router.push('posts/add-posts'); // Navigate to the 'add-posts' page
//   };

//   return (
//     <div className='min-h-screen flex flex-col items-center'>
//       <h1 className='text-2xl font-bold mb-4 text-center w-full'>
//         Posts
//       </h1>

//       <div className='mb-4'>
//         <button className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700' onClick={handleNavigate}>
//           Add Post
//         </button>
//       </div>

//       <div className='w-full max-w-3xl px-4'>
//         {error ? (
//           <p className='text-red-500'>Error fetching posts: {error}</p>
//         ) : (
//           <ul className='border border-black'>
//             {posts.length > 0 ? (
//               posts.map(post => (
//                 <li className='p-4 border-b border-black flex justify-between items-center' key={post._id}>
//                   <span>{post.name}</span>
//                   <button
//                     onClick={() => handleDelete(post._id)} // Add the delete handler
//                     className='px-2 py-1 bg-red-500 text-white rounded hover:bg-red-700'
//                   >
//                     Delete
//                   </button>
//                 </li>
//               ))
//             ) : (
//               <li className='p-4'>No posts available</li>
//             )}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// }




// ///