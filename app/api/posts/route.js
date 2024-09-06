
// app/api/posts/route.js
import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

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

    const { name } = await req.json();

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return new Response(JSON.stringify({ error: 'Name is required and must be a valid string' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    const result = await db.collection('posts').insertOne({ name });

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

export async function DELETE(req) {
  try {
    const client = await clientPromise;
    const db = client.db('blogapp');

    const postId = req.nextUrl.pathname.split('/').pop();

    if (!postId || !ObjectId.isValid(postId)) {
      return new Response(JSON.stringify({ error: 'Invalid post ID' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    const result = await db.collection('posts').deleteOne({ _id: new ObjectId(postId) });

    if (result.deletedCount === 0) {
      return new Response(JSON.stringify({ error: 'Post not found' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 404,
      });
    }

    return new Response(JSON.stringify({ message: 'Post deleted successfully' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error deleting post:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete post' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}



///