
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

    // Parse the request body to get post data
    const { name, content } = await req.json();

    // Insert a new post into the 'posts' collection
    const result = await db.collection('posts').insertOne({ name,});

    // Use result.insertedId to get the ID of the newly inserted document
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