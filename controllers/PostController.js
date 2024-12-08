import TouristGuidePost from '../models/TouristGuidePost.js';
import User from '../models/User.js';  // Assuming there is a User model
import jwt from 'jsonwebtoken';

export const createTouristGuidePost = async (req, res) => {
  const { title, category, content, imageURL, description } = req.body;

  // Validation for required fields
  if (!title || !category || !content || !description) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Get the token from cookies
    const token = req.cookies?.token; // Optional chaining for safety

    // Check if token exists
    if (!token) {
      return res.status(403).json({ message: 'Access denied, no token provided' });
    }

    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Extract the user ID from the token payload
    const createdBy = decoded.id;

    // Validate if the user exists
    const user = await User.findById(createdBy);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create a new Tourist Guide Post
    const newPost = new TouristGuidePost({
      title,
      category,
      content,
      imageURL,
      description,
      createdBy,
    });

    // Save the post to the database
    await newPost.save();

    // Respond with the created post
    res.status(201).json(newPost);

  } catch (error) {
    console.error('Error creating post:', error);
    res.status(400).json({ message: error.message });
  }
};


// Get all tourist guide posts
export const getAllTouristGuidePosts = async (req, res) => {
  try {
    const posts = await TouristGuidePost.find()
      .populate('createdBy', 'name email')  // Populate user details (optional)
      .populate('reviews.user', 'name email')  // Populate reviews with user details (optional)
      .exec();

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single tourist guide post by ID
export const getSingleTouristGuidePost = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await TouristGuidePost.findById(id)
      .populate('createdBy', 'name email')
      .populate('reviews.user', 'name email');

    if (!post) {
      return res.status(404).json({ message: 'Tourist guide post not found' });
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a tourist guide post
export const updateTouristGuidePost = async (req, res) => {
  const { id } = req.params;
  const { title, category, content, imageURL, description } = req.body;

  // Validation
  if (!title || !category || !content || !description) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const updatedPost = await TouristGuidePost.findByIdAndUpdate(
      id,
      { title, category, content, imageURL, description },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: 'Tourist guide post not found' });
    }

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a tourist guide post
export const deleteTouristGuidePost = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedPost = await TouristGuidePost.findByIdAndDelete(id);

    if (!deletedPost) {
      return res.status(404).json({ message: 'Tourist guide post not found' });
    }

    res.status(200).json({ message: 'Tourist guide post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a review to a tourist guide post
export const addReviewToTouristGuidePost = async (req, res) => {
  const { id } = req.params; // Tourist Guide Post ID
  const { userId, reviewText, rating } = req.body; // Review info

  // Validation
  if (!reviewText || !rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Invalid review or rating' });
  }

  try {
    // Check if the tourist guide post exists
    const post = await TouristGuidePost.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Tourist guide post not found' });
    }

    // Add the review to the post's reviews array
    post.reviews.push({ user: userId, reviewText, rating });
    await post.save();

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
