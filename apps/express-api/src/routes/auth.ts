import { Router } from "express";
import { post, signin, signup } from "../controllers/auth.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/verify", authMiddleware, post);

export default router;
