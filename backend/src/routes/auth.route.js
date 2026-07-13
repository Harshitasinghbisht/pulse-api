import express from "express";
import {authenticate} from "../middleware/auth.middleware.js";
import {registerUser, userVerify, loginUser, getMe, logout, forgotPassword, resetPassword} from "../controller/auth.controller.js";

 const userRouter=express.Router();

 userRouter.post("/register",authenticate,registerUser);
 userRouter.post("/login",authenticate,loginUser);
 userRouter.post("/logout",authenticate,logout);

 userRouter.get("/verify-email/:token",authenticate,userVerify);
 userRouter.get("/me",authenticate,getMe);

 export default userRouter;