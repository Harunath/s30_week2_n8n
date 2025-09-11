import { NodeType } from "@repo/db/client";
import prisma from "@repo/db/client";
import { Request, Response } from "express";

export const getAvailableIntegrations = async (req: Request, res: Response) => {
	try {
		const integrations = await prisma.avaliableIntegrations.findMany();
		res.status(200).json({ data: integrations });
	} catch {
		res.status(500).json({ message: "Internal server error" });
	}
};

export const getAvailableIntegrationById = async (
	req: Request,
	res: Response
) => {
	try {
		const { id } = req.params;
		if (!id) {
			return res.status(400).json({ message: "ID is required" });
		}
		const integration = await prisma.avaliableIntegrations.findUnique({
			where: { id },
		});
		if (!integration) {
			return res.status(404).json({ message: "Integration not found" });
		}
		return res.status(200).json({ data: integration });
	} catch {
		res.status(500).json({ message: "Internal server error" });
	}
};

export const createAvailableIntegration = async (
	req: Request,
	res: Response
) => {
	try {
		const { name, icon, nodeType } = req.body;
		if (!name || !icon || !nodeType || (nodeType as NodeType) === undefined) {
			return res
				.status(400)
				.json({ message: "Name and description are required" });
		}
		const newIntegration = await prisma.avaliableIntegrations.create({
			data: { name, icon, type: nodeType },
		});
		res.status(201).json({ data: newIntegration });
	} catch {
		res.status(500).json({ message: "Internal server error" });
	}
};

export const updateAvailableIntegration = async (
	req: Request,
	res: Response
) => {
	try {
		const { id } = req.params;
		const { name, icon, nodeType } = req.body;
		if (!id) {
			return res.status(400).json({ message: "ID is required" });
		}
		const queryData: { name?: string; icon?: string; type?: NodeType } = {};
		if (name) queryData.name = name;
		if (icon) queryData.icon = icon;
		if (nodeType && (nodeType as NodeType) !== undefined)
			queryData.type = nodeType;
		if (Object.keys(queryData).length === 0) {
			return res.status(400).json({
				message: "At least one field (name, icon, nodeType) is required",
			});
		}
		const integration = await prisma.avaliableIntegrations.findUnique({
			where: { id },
		});
		if (!integration) {
			return res.status(404).json({ message: "Integration not found" });
		}
		const updatedIntegration = await prisma.avaliableIntegrations.update({
			where: { id },
			data: queryData,
		});
		res.status(200).json({ data: updatedIntegration });
	} catch {
		res.status(500).json({ message: "Internal server error" });
	}
};

export const deleteAvailableIntegration = async (
	req: Request,
	res: Response
) => {
	try {
		const { id } = req.params;
		if (!id) {
			return res.status(400).json({ message: "ID is required" });
		}
		const integration = await prisma.avaliableIntegrations.findUnique({
			where: { id },
		});
		if (!integration) {
			return res.status(404).json({ message: "Integration not found" });
		}
		await prisma.avaliableIntegrations.delete({
			where: { id },
		});
		res.status(200).json({ message: "Integration deleted successfully" });
	} catch {
		res.status(500).json({ message: "Internal server error" });
	}
};
