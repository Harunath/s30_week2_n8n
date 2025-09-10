import { Router } from "express";

import { authMiddleware } from "../middlewares/auth.js";

import {
	createAvailableIntegration,
	deleteAvailableIntegration,
	getAvailableIntegrations,
	updateAvailableIntegration,
	getAvailableIntegrationById,
} from "../controllers/avaliableIntegrations.js";

const router = Router();

router.post(
	"/admin/available-integrations",
	authMiddleware,
	createAvailableIntegration
);
router.put(
	"/admin/available-integrations",
	authMiddleware,
	updateAvailableIntegration
);
router.get(
	"/admin/available-integrations",
	authMiddleware,
	getAvailableIntegrations
);
router.get(
	"/admin/available-integrations/:id",
	authMiddleware,
	getAvailableIntegrationById
);
router.delete(
	"/admin/available-integrations",
	authMiddleware,
	deleteAvailableIntegration
);

export default router;
