import { Request, Response } from "express";
import prisma from "@repo/db/client";

export const createConnection = async (req: Request, res: Response) => {
	try {
		const { workflowId, fromNodeId, toNodeId, fromPort, toPort } = req.body;
		const workflow = await prisma.workflow.findUnique({
			where: { id: workflowId },
		});
		if (!workflow) {
			return res.status(400).json({ error: "Invalid workflowId" });
		}
		const nodes = await prisma.node.findMany({
			where: { id: { in: [fromNodeId, toNodeId] }, workflowId },
		});
		if (
			!nodes ||
			nodes.length !== 2 ||
			!nodes[0] ||
			!nodes[1] ||
			nodes[0].workflowId !== nodes[1].workflowId
		) {
			return res
				.status(400)
				.json({ error: "Both nodes must belong to the specified workflow" });
		}
		const newConnection = await prisma.connection.create({
			data: {
				workflowId,
				fromNodeId,
				toNodeId,
				fromPort,
				toPort,
			},
		});
		res.json(newConnection);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Failed to create connection" });
	}
};

export const getConnectionsByWorkflowId = async (
	req: Request,
	res: Response
) => {
	try {
		const { workflowId } = req.params;
		const connections = await prisma.connection.findMany({
			where: { workflowId },
		});
		res.json(connections);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Failed to fetch connections" });
	}
};

export const updateConnection = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const { fromNodeId, toNodeId, fromPort, toPort } = req.body;
		const nodes = await prisma.node.findMany({
			where: {
				id: { in: [fromNodeId, toNodeId] },
			},
		});
		if (
			nodes.length !== 2 ||
			!nodes[0] ||
			!nodes[1] ||
			nodes[0].workflowId !== nodes[1].workflowId
		) {
			return res
				.status(400)
				.json({ error: "Both nodes must belong to the specified workflow" });
		}
		const updatedConnection = await prisma.connection.update({
			where: { id },
			data: { fromNodeId, toNodeId, fromPort, toPort },
		});
		res.json(updatedConnection);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Failed to update connection" });
	}
};

export const getConnectionById = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const connection = await prisma.connection.findUnique({
			where: { id },
		});
		if (!connection) {
			return res.status(404).json({ error: "Connection not found" });
		}
		res.json(connection);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Failed to fetch connection" });
	}
};

export const deleteConnection = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		await prisma.connection.delete({ where: { id } });
		res.json({ message: "Connection deleted" });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Failed to delete connection" });
	}
};
