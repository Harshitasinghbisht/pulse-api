import jwt from "jsonwebtoken";
import {prisma} from "../config/prisma.js"

export const authenticate=async(req,res,next)=>{
  try {
      const token=req.cookies.token;
  
      if(!token){
        console.error("middleware",error)
          return res.status(401).json({
              success:false,
              message:"authentication failed"
          })
      }
  
      const decoded=jwt.verify(token,process.env.JWT_SECRET);
      const user=await prisma.user.findUnique({
        where:{id:decoded.id},
        select: {
            id: true,
            name: true,
            email: true,
            isVerified: true
    }
      })
   if(!user){
          return res.status(401).json({
              success:false,
              message:"user not found"
          })
      }
      req.user=user;
      next();
  } catch (error) {
    console.error("authmiddleware error",error)
     return res.status(401).json({
              success:false,
              message:"Invalid or expired token"
          })
  }
}