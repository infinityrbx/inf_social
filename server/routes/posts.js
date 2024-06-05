import express from "express";
import {
  getFeedPosts,
  getUserPosts,
  likePost,
  createCommentPost,
  deleteCommentPost,
} from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */

router.get("/", verifyToken, getFeedPosts);
router.get("/:userId", verifyToken, getUserPosts);

/* UPDATE */
router.patch("/:id/like", verifyToken, likePost);
router.post("/:id/comment", verifyToken, createCommentPost);
router.delete("/:id/comment/:commentId", verifyToken, deleteCommentPost);

export default router;
