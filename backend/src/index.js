import dotenv from "dotenv";
dotenv.config();
import express from "express"
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import {fileURLToPath} from "url"
import helmet from "helmet";
import apiRouter from "./routes/index.js"

const PORT = process.env.PORT || 9000

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(helmet())
app.use(express.json( {limit: "10mb"}));
app.use(express.urlencoded({ limit: "10mb", extended: false }));;
app.use(cookieParser());
app.use(cors({origin: process.env.CLIENT_URL,credentials: true,}));

app.use("/api", apiRouter);

app.listen(PORT, ()=> console.log("Server running ...."))
