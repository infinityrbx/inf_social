import mongoose from "mongoose";
import Post from "../models/Posts.js";
import User from "../models/User.js";

/* CREATE */
export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body;
    const user = await User.findById(userId);
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      like: {},
      comments: [],
    });
    await newPost.save();

    const post = await Post.find();
    res.status(201).json(post);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

/* READ */
export const getFeedPosts = async (req, res) => {
  try {
    const post = await Post.find();
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = await Post.find({ userId });
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const likePost = async (req, res) => {
  try {
    const postId = req.params.id; // Get the raw ID from params
    const userId = req.user.id; // Assuming you have authentication middleware

    // Convert postId to a proper ObjectId
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }

    const postObjectId = new mongoose.Types.ObjectId(postId);

    const post = await Post.findById(postObjectId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (!post.likes || !(post.likes instanceof Map)) {
      return res.status(500).json({ message: "Invalid likes data in post" });
    }

    const isLiked = post.likes.get(userId);

    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      postObjectId,
      { likes: post.likes },
      { new: true }
    );

    res.status(200).json(updatedPost); // Return the updated post
  } catch (err) {
    res.status(500).json({ message: err.message }); // Use 500 for server errors
  }
};
