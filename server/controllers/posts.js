import mongoose from "mongoose";
import Post from "../models/Posts.js";
import User from "../models/Users.js";

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

export const createCommentPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { userId, comment } = req.body;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }
    if (!comment) {
      return res.status(400).json({ message: "Comment text is required" });
    }
    const postObjectId = new mongoose.Types.ObjectId(postId);
    const post = await Post.findById(postObjectId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const newComment = {
      userId,
      comment,
    };

    const updatedPost = await Post.findByIdAndUpdate(
      postObjectId,
      { $push: { comments: newComment } },
      { new: true }
    );

    res.status(201).json(updatedPost);
  } catch (error) {
    res.status(404).json({ message: error.message });
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
    const postId = req.params.id;
    const userId = req.body.userId; // Get userId from the request body

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

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* DELETE */

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }
    const postObjectId = new mongoose.Types.ObjectId(postId);

    const post = await Post.findByIdAndDelete(postObjectId);
    res.status(200).json("Post has been deleted");
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const deleteCommentPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const commentId = req.params.commentId;

    if (
      !mongoose.Types.ObjectId.isValid(postId) ||
      !mongoose.Types.ObjectId.isValid(commentId)
    ) {
      return res.status(400).json({ message: "Invalid post or comment ID" });
    }

    const updatedPost = await Post.findOneAndUpdate(
      { _id: postId },
      { $pull: { comments: { _id: commentId } } },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({
        message: "Post or comment not found, or you are not authorized",
      });
    }

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
