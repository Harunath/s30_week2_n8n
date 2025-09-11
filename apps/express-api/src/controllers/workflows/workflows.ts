import prisma from "@repo/db/client";
import { Request, Response } from "express";

export const createWorkflow = async (req: Request, res: Response) => {
	try {
		const { name, description, userId } = req.body;
		const newWorkflow = await prisma.workflow.create({
			data: {
				name,
				description,
				userId,
			},
		});
		res.json(newWorkflow);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Failed to create workflow" });
	}
};

export const getWorkflows = async (req: Request, res: Response) => {
	try {
		const workflows = await prisma.workflow.findMany();
		res.json(workflows);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Failed to fetch workflows" });
	}
};

export const getWorkflowById = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const workflow = await prisma.workflow.findUnique({
			where: { id },
			include: {
				nodes: true,
				connections: true,
			},
		});
		if (!workflow) {
			return res.status(404).json({ error: "Workflow not found" });
		}
		res.json(workflow);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Failed to fetch workflow" });
	}
};

export const updateWorkflow = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const { name, description, canvasX, canvasY, canvasZoom } = req.body;
		const updatedWorkflow = await prisma.workflow.update({
			where: { id },
			data: { name, description, canvasX, canvasY, canvasZoom },
		});
		res.json(updatedWorkflow);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Failed to update workflow" });
	}
};

export const deleteWorkflow = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		await prisma.workflow.delete({ where: { id } });
		res.json({ message: "Workflow deleted successfully" });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Failed to delete workflow" });
	}
};
