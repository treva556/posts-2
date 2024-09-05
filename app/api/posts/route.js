
// app/api/posts/route.js
import clientPromise from '../../../lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('blogapp');
    const posts = await db.collection('posts').find({}).toArray();

    return new Response(JSON.stringify(posts), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch posts' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}

export async function POST(req) {
  try {
    const client = await clientPromise;
    const db = client.db('blogapp');

    // Parse the request body to get the post data
    const { name } = await req.json();

    // Check if name is provided and not empty
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return new Response(JSON.stringify({ error: 'Name is required and must be a valid string' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 400,  // Bad request
      });
    }

    // Insert a new post into the 'posts' collection
    const result = await db.collection('posts').insertOne({ name });

    // Return success response with the inserted post ID
    return new Response(JSON.stringify({
      message: 'Post added successfully',
      postId: result.insertedId,
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: 201,
    });
  } catch (error) {
    console.error('Error adding post:', error);
    return new Response(JSON.stringify({ error: 'Failed to add post' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}