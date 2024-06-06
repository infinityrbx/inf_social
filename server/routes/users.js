import express from "express";
import {
  getUser,
  getAllUser,
  getUserFriends,
  updateUser,
  addRemoveFriend,
} from "../controllers/users.js";

import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/get", verifyToken, getAllUser);
router.get("/:id", verifyToken, getUser);
router.get("/:id/friends", verifyToken, getUserFriends);

/* UPDATE */
router.put("/:id", verifyToken, updateUser);
router.patch("/:id/:friendId", verifyToken, addRemoveFriend);

export default router;
