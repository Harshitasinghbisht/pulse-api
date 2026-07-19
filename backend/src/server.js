import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { prisma } from "../src/config/prisma.js";

//importhing the routes
import userRouter from "./routes/auth.route.js";
import workspaceRouter from "./routes/workspace.route.js"

dotenv.config();
const app=express();
const port=process.env.PORT || 4000;

app.use(cors({
    origin:'https://localhost:5173',
    credentials:true,
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS', 'PUT', 'PATCH'],
    allowedHeaders:['Content-Type','Authorization']
}))

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());


app.use("/api/v1/auth",userRouter);
app.use("/api/v1/workspace",workspaceRouter);

// 404 Route Handler
app.use((req, res) => {
    return res.status(404).json({
        success: false,
        message: "Route not found.",
    });
});

const startServer=async()=>{
    try {
        await prisma.$connect();
        console.log("Connected to NEON Postgres");
        app.listen(port,()=>{
        console.log(`app listning to port http://localhost:${port}`);

})
    } catch (error) {
        console.error("Failed to connect to Database",error);
        process.exit(1);
    }
};
startServer();
