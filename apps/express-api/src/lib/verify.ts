import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

export default function verifyToken(token: string) {
	try {
		const { email } = jwt.verify(token, SECRET_KEY) as jwt.JwtPayload;
		if (!email) {
			return null;
		}
		return email;
	} catch {
		return null;
	}
}
