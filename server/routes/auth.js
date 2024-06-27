import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { login, updatePassword } from "../controllers/auth.js";

const router = express.Router();

router.post("/login", login);
router.post("/updatePwd", verifyToken, updatePassword)

export default router;
