import { Router } from "express";

import { authMiddleware } from "../middlewares/auth.js";
import {
	createTGAPIKEY,
	deleteTGAPIKEY,
	getTGAPIKEY,
	updateTGAPIKEY,
} from "../controllers/credentials/telegram.js";
import {
	createRSAPIKEY,
	deleteRSAPIKEY,
	getRSAPIKEY,
	updateRSAPIKEY,
} from "../controllers/credentials/resend.js";

const router = Router();

router.post("/credentials/tg", authMiddleware, createTGAPIKEY);
router.put("/credentials/tg", authMiddleware, updateTGAPIKEY);
router.get("/credentials/tg", authMiddleware, getTGAPIKEY);
router.delete("/credentials/tg", authMiddleware, deleteTGAPIKEY);

router.post("/credentials/rs", authMiddleware, createRSAPIKEY);
router.put("/credentials/rs", authMiddleware, updateRSAPIKEY);
router.get("/credentials/rs", authMiddleware, getRSAPIKEY);
router.delete("/credentials/rs", authMiddleware, deleteRSAPIKEY);

export default router;
