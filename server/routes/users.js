import express from "express";
import {
  getUser,
  getAllUser,
  getUserFriends,
  updateUser,
  addRemoveFriend,
  setFreeze,
  deleteUser,
} from "../controllers/users.js";

import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/get", verifyToken, getAllUser);
router.get("/:id", verifyToken, getUser);
router.get("/:id/friends", verifyToken, getUserFriends);

/* UPDATE */
router.post("/", verifyToken, updateUser);
router.patch("/:id/:friendId", verifyToken, addRemoveFriend);
router.patch("/:id", verifyToken, setFreeze);


export default router;
