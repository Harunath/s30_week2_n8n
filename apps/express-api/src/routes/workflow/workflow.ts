import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.js";
import {
	createWorkflow,
	deleteWorkflow,
	getWorkflowById,
	getWorkflows,
	updateWorkflow,
} from "../../controllers/workflows/workflows.js";

const router = Router();

router.post("/workflows", authMiddleware, createWorkflow);
router.put("/workflows/:id", authMiddleware, updateWorkflow);
router.get("/workflows", authMiddleware, getWorkflows);
router.get("/workflows/:id", authMiddleware, getWorkflowById);
router.delete("/workflows/:id", authMiddleware, deleteWorkflow);

export default router;
