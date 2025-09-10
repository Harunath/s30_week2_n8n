import { prisma } from "@repo/db/client";
import { Request, Response } from "express";

export const getAvailableIntegrations = async (req: Request, res: Response) => {
	try {
		const integrations = await prisma.AvaliableIntegrations.findMany();
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
		const integration = await prisma.AvaliableIntegrations.findUnique({
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
		const { name, description } = req.body;
		if (!name || !description) {
			return res
				.status(400)
				.json({ message: "Name and description are required" });
		}
		const newIntegration = await prisma.AvaliableIntegrations.create({
			data: { name, description },
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
		const { name, description } = req.body;
		if (!id) {
			return res.status(400).json({ message: "ID is required" });
		}
		const integration = await prisma.AvaliableIntegrations.findUnique({
			where: { id },
		});
		if (!integration) {
			return res.status(404).json({ message: "Integration not found" });
		}
		const updatedIntegration = await prisma.AvaliableIntegrations.update({
			where: { id },
			data: { name, description },
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
		const integration = await prisma.AvaliableIntegrations.findUnique({
			where: { id },
		});
		if (!integration) {
			return res.status(404).json({ message: "Integration not found" });
		}
		await prisma.AvaliableIntegrations.delete({
			where: { id },
		});
		res.status(200).json({ message: "Integration deleted successfully" });
	} catch {
		res.status(500).json({ message: "Internal server error" });
	}
};
