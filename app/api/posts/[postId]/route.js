


//app/api/posts/[postId]/route.js
import { connectToDatabase } from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const { method } = req;
  const { postId } = req.query;

  const { db } = await connectToDatabase();
  const postsCollection = db.collection('posts');

  if (method === 'POST') {
    try {
      const { text, author } = req.body;

      if (!text || !author) {
        return res.status(400).json({ error: 'Author and text are required' });
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
        return res.status(404).json({ error: 'Post not found' });
      }

      res.status(200).json({ message: 'Comment added successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}

