import mongoose from 'mongoose';

// Tourist Guide Post schema
const touristGuidePostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Hotels', 'Restaurants', 'Destinations', 'Attractions', 'Services'], // Specific categories for a tourist guide
    trim: true,
  },
  createdTime: {
    type: Date,
    default: Date.now, // Automatically sets the current date and time
  },
  content: {
    type: String,
    required: true, // Description of the place, service, or destination
  },
  imageURL: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    required: true,  // Short description for the tourist guide post
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 3,  // Default rating
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,  // Reference to User model
    ref: 'User',
    required: true,  // The user who created the post
  },
  reviews: [{
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User',  // Reference to the User model for the reviewer's details
      required: true,
    },
    reviewText: {
      type: String,
      required: true,  // The review text by the user
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,  // Rating given by the user (1-5)
    },
    createdAt: {
      type: Date,
      default: Date.now,  // When the review was created
    },
  }],
});

// Create the TouristGuidePost model
const TouristGuidePost = mongoose.model('TouristGuidePost', touristGuidePostSchema);

// Export the TouristGuidePost model
export default TouristGuidePost;
