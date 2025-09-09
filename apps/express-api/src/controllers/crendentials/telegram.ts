import { Request, Response } from "express";

export const createTGAPIKEY = async (req: Request, res: Response) => {
	try {
		const { apiKey } = req.body;
		if (!apiKey) {
			return res.status(400).json({ message: "API key is required" });
		}
		// Here you would typically save the API key to your database
		console.log("Received Telegram API Key:", apiKey);
		res.status(200).json({ message: "API key received successfully" });
	} catch (err) {
		console.log(err);
		res.status(500).json({ message: "Internal Server Error" });
	}
};
