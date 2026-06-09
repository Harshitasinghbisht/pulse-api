import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/auth.route.js";

dotenv.config();
const app=express();
const port=process.env.PORT || 4000;
app.use(cookieParser());
app.use(cors({
    origin:'https://localhost:5173'
}))

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get("/test",(req,res)=>{
    res.send("server is working");
})

app.get("/slow",(req,res)=>{
    setTimeout(()=>{
        res.send("slow responce")
    },2000)
})

app.get("/error",(req,res)=>{
    res.status(500).send("Somthing went wrong")
})


app.use("/api/v1/user",userRouter);

app.listen(port,()=>{
    console.log("sever is listning to the port ",port)
})