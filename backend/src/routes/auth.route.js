import express from "express";
import { RegisterUser } from "../controller/auth.controller.js";
 const userRouter=express.Router();

 userRouter.post("/register",RegisterUser);

 export default userRouter;