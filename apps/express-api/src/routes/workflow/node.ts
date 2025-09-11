import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.js";
import {
	createNode,
	deleteNode,
	getNodeById,
	getNodesByWorkflowId,
	updateNode,
} from "../../controllers/workflows/nodes.js";

const router = Router();

router.get("/nodes/:id", getNodeById);
router.get("/nodes/:workflowId", getNodesByWorkflowId);
router.post("/nodes", createNode);
router.put("/nodes/:id", updateNode);
router.delete("/nodes/:id", deleteNode);

export default router;
