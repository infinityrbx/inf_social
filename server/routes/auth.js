import express from "express";

import { login, googleAuth } from "../controllers/auth.js";

const router = express.Router();

router.post("/login", login);
router.get("/google", googleAuth);

export default router;
