import { Request, Response } from "express";
import generateJWT from "../lib/jwtGenerator.js";
import verifyToken from "../lib/verify.js";
import { generateOTP } from "../lib/OTPGenerator.js";
import { sendOtpMail } from "../lib/mail/otpMail.js";
import { prisma } from "@repo/db/client";
import bcrypt from "bcrypt";
interface UserType {
	email: string;
	password: string;
	jwt?: string;
	otp?: string;
	verified?: boolean;
}

const users: UserType[] = [];

export const signup = async (req: Request, res: Response) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return res.status(400).json({ message: "Email and password are required" });
	}
	const otp = generateOTP();
	// users.push({ email, password, otp, verified: false });
	const hash = await bcrypt.hash(password, 10);
	const existingUser = await prisma.user.findUnique({
		where: { email },
	});
	if (existingUser) {
		return res.status(409).json({ message: "User already exists" });
	}
	const verifyEmail = await prisma.verifyEmail.create({
		data: {
			email,
			otp,
			expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 15 minutes from now
		},
	});
	const user = await prisma.user.create({
		data: {
			email,
			password: hash,
			verified: false,
		},
	});
	const token = generateJWT({ email });
	process.env.NODE_ENV == "production" &&
		(await sendOtpMail({ to: email, otp }));
	res.status(200).json({
		message: "User signed up & signed in successfully",
		email,
		token,
		otp:
			process.env.NODE_ENV !== "production"
				? otp
				: "successfully sent to " + email,
	});
};

export const signin = async (req: Request, res: Response) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return res.status(400).json({ message: "Email and password are required" });
	}
	const user = await prisma.user.findUnique({
		where: { email },
	});
	if (!user) {
		return res.status(401).json({ message: "user not found " });
	}
	const isPasswordValid = await bcrypt.compare(password, user.password);
	if (!isPasswordValid) {
		return res.status(401).json({ message: "Invalid password" });
	}
	const token = generateJWT({ email });
	const otp = generateOTP();
	process.env.NODE_ENV == "production" &&
		(await sendOtpMail({ to: email, otp }));
	return res.status(200).json({
		message: "check your mail",
		email,
		token,
		otp:
			process.env.NODE_ENV !== "production"
				? otp
				: "successfully sent to " + email,
	});
};

export const post = async (req: Request, res: Response) => {
	const token = req.query.token as string;
	const { otp } = req.body;

	try {
		const email = await verifyToken(token);
		if (!email) {
			return res.status(401).json({ message: "Invalid token" });
		}
		const user = await prisma.user.findUnique({
			where: { email },
		});
		if (!user) {
			return res.status(401).json({ message: "user not found " });
		}
		const verifyEmail = await prisma.verifyEmail.findFirst({
			where: { email, expiresAt: { gt: new Date() } },
		});
		if (verifyEmail.otp !== otp) {
			return res.status(401).json({ message: "Invalid OTP" });
		}
		await prisma.user.update({
			where: { email },
			data: { verified: true },
		});

		res.cookie("token", token, { httpOnly: true });

		return res.redirect(302, `${process.env.CLIENT_URL}/dashboard`);
	} catch {
		return res.status(500).json({ message: "Internal server error" });
	}
};
