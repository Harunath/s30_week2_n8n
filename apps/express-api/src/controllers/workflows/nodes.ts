import prisma from "@repo/db/client";
import { Request, Response } from "express";

export const createNode = async (req: Request, res: Response) => {
	try {
		const { workflowId, name, credentialsId, AvaliableIntegrationsId, x, y } =
			req.body;

		const workflow = await prisma.workflow.findUnique({
			where: { id: workflowId },
		});
		if (!workflow) {
			return res.status(400).json({ error: "Invalid workflowId" });
		}
		const credentialsIdsExist = await prisma.credentials.findFirst({
			where: { id: credentialsId },
		});
		if (!credentialsIdsExist) {
			return res.status(400).json({ error: "Invalid credentialsId" });
		}

		const avaliableIntegrationExists =
			await prisma.avaliableIntegrations.findFirst({
				where: { id: AvaliableIntegrationsId },
			});
		if (!avaliableIntegrationExists) {
			return res.status(400).json({ error: "Invalid AvaliableIntegrationsId" });
		}

		const newNode = await prisma.node.create({
			data: {
				workflowId,
				name,
				credentialsId,
				AvaliableIntegrationsId,
				x,
				y,
			},
		});
		res.json(newNode);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Failed to create node" });
	}
};

export const getNodesByWorkflowId = async (req: Request, res: Response) => {
	try {
		const { workflowId } = req.params;
		const nodes = await prisma.node.findMany({
			where: { workflowId },
		});
		res.json(nodes);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Failed to fetch nodes" });
	}
};

export const getNodeById = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const node = await prisma.node.findUnique({
			where: { id },
		});
		if (!node) {
			return res.status(404).json({ error: "Node not found" });
		}
		res.json(node);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Failed to fetch node" });
	}
};

export const updateNode = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const { name, credentialsId, AvaliableIntegrationsId, x, y } = req.body;
		const updatedNode = await prisma.node.update({
			where: { id },
			data: {
				name,
				credentialsId,
				AvaliableIntegrationsId,
				x,
				y,
			},
		});
		res.json(updatedNode);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Failed to update node" });
	}
};

export const deleteNode = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		await prisma.node.delete({
			where: { id },
		});
		res.json({ message: "Node deleted successfully" });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Failed to delete node" });
	}
};
