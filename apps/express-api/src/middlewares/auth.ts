import prisma from "@repo/db/client";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

export async function authMiddleware(
	req: Request & { userId?: any },
	res: Response,
	next: NextFunction
) {
	const token = req.headers.authorization?.split(" ")[1];
	if (!token) {
		return res.status(401).json({ error: "No token provided" });
	}

	try {
		const { email } = jwt.verify(token, SECRET_KEY) as jwt.JwtPayload;
		if (!email) return res.status(401).json({ error: "Invalid token" });

		const user = await prisma.user.findFirst({ where: { email } });
		if (!user) return res.status(404).json({ error: "User not found" });

		req.userId = user.id;
		next();
	} catch (err) {
		return res.status(401).json({ error: "Unauthorized" });
	}
}
