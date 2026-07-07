import {PrismaClient} from "@prisma/client";
import bycrypt from "bcryptjs";
import crypto from "crypto";

const prisma=new PrismaClient();

export const registerUser=(req,res)=>{
    const {name,email,password}=req.body;
    if(!name || !email || !password){
       console.log("all filed are required")

       return res.status(400).json({
        success:false,
        message:"All fields are required"
       })
    }
    try {
       const existingUser=await prisma.user.findUnique({
            where:{email}
        })

        if(existingUser){
        return res.status(400).json({
        success:false,
        message:"User alreaddy exist"
       }) 
        }

        //hash password
      const hashPassword=await  bycrypt.hash(password,10);
     const verificationToken= crypto.randomBytes(32).toString("hex")
    } catch (error) {
        
    }
}


