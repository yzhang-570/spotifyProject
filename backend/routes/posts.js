import express from 'express'; 
import { fetchAllPosts, fetchPostById, createMainPost, voteOnPost } from '../db/posts.js'; 

const router = express.Router(); 

const requireAuth = (req, res, next) => {
  if (!req.session.user?.id) {
    return res.status(401).json({ error: 'Not logged in' });
  }

  next();
};

router.use(requireAuth);

// GET /posts - Gets all main posts for the feed page
router.get('/', async (req, res) => {
  try {
    const userId = req.session.user?.id;
    const posts = await fetchAllPosts(userId);
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error getting posts:', error);
    res.status(500).json({ message: 'Error getting posts' });
  }
});

// GET /posts/:postId - Gets a specific post and all its replies
router.get('/:postId', async (req, res) => { 
  try {
    const { postId } = req.params; 
    const threadData = await fetchPostById(postId); 
    res.status(200).json(threadData); 
  } catch (error) { 
    console.error('Error getting discussion thread:', error); 
    res.status(500).json({ message: 'Error getting discussion thread' }); 
  } 
}); 

router.post('/', async (req, res) => {
  const title = req.body.title?.trim();
  const content = req.body.content?.trim();

  if (!title || !content) {
    return res.status(400).json({
      error: 'Title and content are required.',
    });
  }

  try {
    const newPost = await createMainPost({
      author: req.session.user.id,
      title,
      content,
    });

    res.status(201).json(newPost);
  } catch (error) {
    console.error('Error creating post:', error);

    res.status(500).json({
      error: 'Unable to create post.',
    });
  }
});

router.patch("/:postId/vote", async (req, res) => {
  const { postId } = req.params;
  const { vote } = req.body; // 1 or -1
  const userId = req.session.user?.id;

  if (!userId) {
    return res.status(401).json({ error: "Not logged in" });
  }

  if (![1, -1].includes(vote)) {
    return res.status(400).json({ error: "Invalid vote" });
  }

  try {
    const updated = await voteOnPost(postId, userId, vote);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Vote failed" });
  }
});

export default router;
