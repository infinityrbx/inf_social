import express from "express";
import {
  getUser,
  getAllUser,
  getUserFriends,
  addRemoveFriend,
} from "../controllers/users.js";

import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/get", verifyToken, getAllUser);
router.get("/:id", verifyToken, getUser); // No verifyToken yet
router.get("/:id/friends", verifyToken, getUserFriends);

/* UPDATE */
router.patch("/:id/:friendId", verifyToken, addRemoveFriend);

export default router;
