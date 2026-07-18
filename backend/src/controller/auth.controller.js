import bcrypt from "bcryptjs";
import crypto from "crypto";
import {sendVerificationEmail,sendResetPasswordEmail}  from '../services/emailService.js';
import {prisma} from "../config/prisma.js"
import jwt from "jsonwebtoken"


export const registerUser=async(req,res)=>{
    const name = req.body.name?.trim();
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;
    if(!name || !email || !password){
        return res.status(400).json({
        success:false,
        message:"All fields are required"
       })
    }

     // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email address.",
      });
    }

     // Validate password
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long.",
      });
    }
    try {
       const existingUser=await prisma.user.findUnique({
            where:{email}
        })
        if(existingUser){
        return res.status(409).json({
        success:false,
        message:"User already exists"
       }) 
        }

      //verfication token
        const token= crypto.randomBytes(32).toString("hex")

        //hash password
      const hashPassword=await  bcrypt.hash(password,10);

      const user=await prisma.user.create({
        data:{
            name,
            email,
            password:hashPassword,
            verificationToken:token
        }
      })

       await sendVerificationEmail("harshitabisht794@gmail.com",token,name);
          
      res.status(201).json({
        success:true,
        message:"Registration successful. Please verify your email"
      })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"Internal server error",
        })
    }
}

export const userVerify=async(req,res)=>{
    
  const {token}=req.params;
 try {
   if(!token){
     return res.status(400).json({
       success:false,
       message:"Invalid token"
     })
   }
 
   const user= await prisma.user.findFirst({
     where:{verificationToken:token}
   })
 
   if(!user){
     return res.status(400).json({
      success:false,
      message:"User not found"
     })
   }
   if(user.isVerified){
      return res.status(400).json({
         success:false,
         message:"User already verified"
      })
     }
     await prisma.user.update({
      where:{id:user.id},
      data:{
        isVerified:true,
        verificationToken:null
      }
     })

     return res.status(200).json({
      success:true,
      message:"User verified successfully"
     })
 } catch (error) {
 console.error("Verification Error:", error);
  return res.status(500).json({
    success:false,
    message:"Internal server error"
  })
 }
}

export const loginUser=async(req,res)=>{
const email = req.body.email?.trim();
const password=req.body.password?.trim();

if(!email  || !password){
  return res.status(400).json({
    success:false,
    message:"All fields are required"
  })
}
try {
  
  const user=await prisma.user.findUnique({
    where:{email}
  })
  
  if(!user){
    return res.status(401).json({
      success:false,
      message:"Invaild email or password"
    })
  }
  
  const isMatched=await bcrypt.compare(password,user.password);
  if(!isMatched){
    return res.status(401).json({
      success:false,
      message:"Invalid email or password"
    })
  }
  
  if(!user.isVerified){
    return res.status(403).json({
      success:false,
      message:"User is not verified"
    })
  }
  
  const token=jwt.sign({id:user.id},
    process.env.JWT_SECRET,
    {expiresIn:"24h"}
  )
  
  const cookiesOption={
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000
  }
  
  res.cookie("token",token,cookiesOption);
  
  return res.status(200).json({
    success:true,
    message:"User login successfully",
    user:{
        id:user.id,
        name:user.name,
        role:user.role,
        email:user.email
    }
  })
} catch (error) {
  console.error("userLoginerror",error);
  return res.status(500).json({
    success:false,
    message:"Internal server error"
  })
}
}

export const getMe=async(req,res)=>{
  try {
  const user=await prisma.user.findUnique({
    where:{id:req.user.id},
    select:{
       name: true,
       email: true,
       role: true
    }
  })
  
  if(!user){
    return res.status(404).json({
      success:false,
      message:"User not found"
    })
  }
  return res.status(200).json({
      success:true,
      message:"User found",
      user
    })
  } catch (error) {
    console.error("getMeError",error)
     return res.status(500).json({
      success:false,
      message:"Internal server error",
    })
  }
}

export const logout=async(req,res)=>{
  try {
    res.clearCookie("token",{
       httpOnly: true,
      secure: true,
      sameSite: "none",
    })
     return res.status(200).json({
      message: "Logout successful",
      success: true
    });
  } catch (error) {
    console.error("logoutError",error)
    return res.status(500).json({
      message: "Internal server error",
      success: false
    });
  }
}

export const forgotPassword=async(req,res)=>{
  const {email}=req.body;
  if(!email){
    return res.status(400).json({
      success:false,
      message:"All fields are required"
    })
  }

  try {
    const user=await prisma.user.findUnique({
      where:{email}
    })

    if(!user){
      return res.status(400).json({
      success:false,
      message:"User not found"
    })
    }
    if (!user.isVerified) {
    return res.status(400).json({
        success: false,
        message: "Please verify your email first."
    });
}
    const token=crypto.randomBytes(32).toString("hex");
    await prisma.user.update({
      where:{id:user.id},
      data:{
        passwordResetToken:token,
        passwordResetExpiry: new Date(Date.now() + 10 * 60 * 1000)
      }
    })

    await sendResetPasswordEmail("harshitabisht794@gmail.com",token,user.name);
     
    return res.status(200).json({
      success:true,
      message:"Password reset email sent successfully"
    })

  } catch (error) {
    console.error("forgotPassworderror",error)
     return res.status(500).json({
      success:false,
      message:"Internal server error"
    })
  }
}

export const resetPassword=async(req,res)=>{
  const {token}=req.params;
  const {resetpassword}=req.body;
   if(!token){
    return res.status(400).json({
      success:false,
      message:"All fields are required"
    })
  }
  if(!resetpassword){
    return res.status(400).json({
      success:false,
      message:"All fields are required"
    })
  }

  try {
    const user=await prisma.user.findUnique({
      where:{passwordResetToken:token}
    })
    if(!user){
      return res.status(400).json({
      success:false,
      message:"User not found"
    })
    }
  
    if(user.passwordResetExpiry<new Date()){
       return res.status(400).json({
      success:false,
      message:"Password reset link has expired."
    })
    }
    const hashedPassword = await bcrypt.hash(resetpassword, 10);
    await prisma.user.update({
      where:{id:user.id},
      data:{
        password:hashedPassword,
        passwordResetExpiry:null,
        passwordResetToken:null
      }
    })
     res.status(200).json({
     success:true,
     message:"password reset successfully"
 })
  } catch (error) {
    console.error("resetpassword error",error)
     res.status(500).json({
     success:false,
     message:"Internal server error"
 })
  }
}

