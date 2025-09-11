import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import authRoutes from "./routes/auth.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/v1/api/auth", authRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log("Server is running on port :", PORT);
});
