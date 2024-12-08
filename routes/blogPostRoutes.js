import express from 'express';
import {
  createTouristGuidePost,
  getAllTouristGuidePosts,
  getSingleTouristGuidePost,
  updateTouristGuidePost,
  deleteTouristGuidePost,
} from '../controllers/PostController.js'; 

const router = express.Router();

// Create a new blog post
router.post('/blog', createTouristGuidePost); // Ensure this matches your request

// Get all blog posts
router.get('/blog', getAllTouristGuidePosts); // Ensure this matches your request

// Get a single blog post by ID
router.get('/blog/:id', getSingleTouristGuidePost);

// Update a blog post
router.put('/blog/:id', updateTouristGuidePost); // Removed authentication

// Delete a blog post
router.delete('/blog/:id', deleteTouristGuidePost); // Removed authentication

export default router;
