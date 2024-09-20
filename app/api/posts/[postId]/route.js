
//app/api/posts/[postId]/route.js
// app/api/posts/[postId]/route.js
import clientPromise from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function DELETE(req) {
  try {
    const client = await clientPromise;
    const db = client.db('blogapp');
    
    // Extract postId from the URL path
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


