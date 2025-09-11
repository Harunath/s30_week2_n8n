import { Router } from "express";
import {
	createConnection,
	deleteConnection,
	getConnectionById,
	getConnectionsByWorkflowId,
	updateConnection,
} from "../../controllers/workflows/connections.js";

const router = Router();

router.post("/connections", createConnection);
router.put("/connections/:id", updateConnection);
router.get("/connections/:workflowId", getConnectionsByWorkflowId);
router.get("/connections/:id", getConnectionById);
router.delete("/connections/:id", deleteConnection);

export default router;
