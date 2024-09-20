
//app/api/[postId]/comments/route.js
import { connectToDatabase } from '../../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(req, { params }) {
  const { postId } = params; // Get the postId from params
  const { db } = await connectToDatabase();
  const postsCollection = db.collection('posts');

  try {
    const { text, author } = await req.json();
    console.log('Received data:', { text, author }); // Add this line
  
    if (!text || !author) {
      return new Response(JSON.stringify({ error: 'Author and text are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const newComment = {
      text,
      author,
      createdAt: new Date(),
    };

    const result = await postsCollection.updateOne(
      { _id: new ObjectId(postId) }, // Find the post by its ID
      { $push: { comments: newComment } } // Add the new comment to the comments array
    );

    if (result.modifiedCount === 0) {
      return new Response(JSON.stringify({ error: 'Post not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ message: 'Comment added successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

} catch (error) {
    console.error('Error parsing JSON:', error); // Add this line
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
