import prisma from "@repo/db/client";
import { Request, Response } from "express";

export const createTGAPIKEY = async (req: Request, res: Response) => {
	try {
		const { apiKey, userId, credentialsId } = req.body;
		if (!apiKey) {
			return res.status(400).json({ message: "API key is required" });
		}
		const existing = await prisma.credentialsObjects.findFirst({
			where: { id: credentialsId, name: "RESEND" },
		});
		if (!existing) {
			return res.status(404).json({ message: "Credentials object not found" });
		}

		const TelegramAPIKey = await prisma.credentials.create({
			data: {
				name: "telegram",
				apiKey: apiKey,
				userId,
				CredentialsId: existing.id,
			},
			select: { id: true, name: true },
		});

		res.status(200).json({ message: TelegramAPIKey.name + " API key created" });
	} catch (err) {
		console.log(err);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

export const getTGAPIKEY = async (req: Request, res: Response) => {
	try {
		const { id, userId } = req.body;
		const tgApiKey = await prisma.credentials.findFirst({
			where: { id, userId },
			select: { apiKey: true },
		});
		if (!tgApiKey) {
			return res.status(404).json({ message: "Telegram API key not found" });
		}
		res.status(200).json({ telegram: tgApiKey });
	} catch (err) {
		console.log(err);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

export const updateTGAPIKEY = async (req: Request, res: Response) => {
	try {
		const { apiKey, id, userId } = req.body;
		if (!apiKey) {
			return res.status(400).json({ message: "API key is required" });
		}
		const existing = await prisma.credentials.findFirst({
			where: { id, userId },
		});
		const updated = await prisma.credentials.updateMany({
			where: { id: existing?.id },
			data: { apiKey: apiKey },
		});

		return res.status(200).json({
			message: "Telegram API key updated",
			updatedCount: updated.count,
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

export const deleteTGAPIKEY = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const { userId } = req.body;
		if (!id) {
			return res.status(400).json({ message: "ID is required" });
		}
		const existing = await prisma.credentials.findUnique({
			where: { id: id, userId },
		});
		const deleted = await prisma.credentials.deleteMany({
			where: { id: existing?.id },
		});

		return res.status(200).json({
			message: "Telegram API key deleted",
			deletedCount: deleted.count,
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({ message: "Internal Server Error" });
	}
};
