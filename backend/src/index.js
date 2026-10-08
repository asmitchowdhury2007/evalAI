import express from "express"
import {clerkMiddleware} from "@clerk/express"
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import {fileURLToPath} from "url"
import helmet from "helmet";
import apiRouter from "./routes/index.js"
import { env } from "./config/env.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

const PORT = env.PORT || 9000

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(clerkMiddleware());
app.use(helmet())
app.use(express.json( {limit: "10mb"}));
app.use(express.urlencoded({ limit: "10mb", extended: false }));;
app.use(cookieParser());
app.use(cors({origin: env.CORS_ORIGIN,credentials: true,}));

app.use("/api", apiRouter);
app.use(notFound);      
app.use(errorHandler)

app.listen(PORT, ()=> console.log("Server running ...."))
