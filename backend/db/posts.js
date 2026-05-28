import express from 'express';
import { fetchPostById } from '../db/posts.js';

const router = express.Router();

// GET /posts/:forumId gets the entire discussion thread
router.get('/:postID', async (req, res) => {
  try {
    const { postId } = req.params;
    const threadData = await fetchPostById(postId);
    res.status(200).json(threadData);
  } catch (error) {
    console.error('Error getting discussion thread:', error);
    res.status(500).json({ message: 'Error getting discussion thread' });
  }
});

export default router;
