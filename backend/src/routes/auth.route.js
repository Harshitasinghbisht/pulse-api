import express from "express";
import {authenticate} from "../middleware/auth.middleware.js";
import {registerUser, userVerify, loginUser, getMe, logout, forgotPassword, resetPassword} from "../controller/auth.controller.js";

 const userRouter=express.Router();

 userRouter.post("/register",registerUser);
 userRouter.post("/login",loginUser);
 userRouter.post("/logout",authenticate,logout);

 userRouter.get("/verify-email/:token",userVerify);
 userRouter.get("/me",authenticate,getMe);

 export default userRouter;