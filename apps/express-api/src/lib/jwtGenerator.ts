import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

export default function generateJWT(
	payload: object,
	expiresIn: number = 3600
): string {
	return jwt.sign(payload, SECRET_KEY, { expiresIn });
}
