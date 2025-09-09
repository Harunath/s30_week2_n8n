import { Request, Response } from "express";
import generateJWT from "../lib/jwtGenerator.js";
import verifyToken from "../lib/verify.js";
import { generateOTP } from "../lib/OTPGenerator.js";
import { sendOtpMail } from "../lib/mail/otpMail.js";

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
	console.log("signup : ", email);
	const otp = generateOTP();
	users.push({ email, password, otp, verified: false });
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
	console.log("signin : ", email);
	const user = users.find((u) => u.email === email);
	if (!user) {
		return res.status(401).json({ message: "user not found " });
	}
	if (user.password !== password) {
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

	try {
		const email = await verifyToken(token);
		if (!email) {
			return res.status(401).json({ message: "Invalid token" });
		}
		const newToken = generateJWT({ email });
		res.cookie("token", newToken);
		return res
			.status(200)
			.json({ message: "Post created successfully", email, token: newToken });
	} catch {
		return res.status(500).json({ message: "Internal server error" });
	}
};

// export const post = async (req: Request, res: Response) => {
// 	const token = req.query.token as string;
// 	// const { otp } = req.body;

// 	try {
// 		const email = await verifyToken(token);
// 		if (!email) {
// 			return res.status(401).json({ message: "Invalid token" });
// 		}
// 		const user = users.find((u) => u.email === email);
// 		if (!user) {
// 			return res.status(401).json({ message: "user not found " });
// 		}
// 		// if (user.otp !== otp) {
// 		// 	return res.status(401).json({ message: "Invalid OTP" });
// 		// }
// 		user.verified = true;
// 		// user.otp = undefined;
// 		res.cookie("token", token, { httpOnly: true });

// 		return res.redirect(302, "http://localhost:3001/v1/dashboard");
// 	} catch {
// 		return res.status(500).json({ message: "Internal server error" });
// 	}
// };
