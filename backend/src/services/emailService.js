import { resend } from "../config/resend.js";

export const sendVerificationEmail = async (
    email,
    token,
    name
) => {
    await resend.emails.send({
        from: "Acme <onboarding@resend.dev>",
        to: email,
        subject: "Verify Email",
        html: `<div style="font-family: Arial, sans-serif; padding: 20px;">
                         <h2>Verify your email</h2>
                         <p>Click the button below to verify your account:</p>
                   
                         <a href="http://localhost:${process.env.PORT}/api/v1/auth/verify-email/${token}" 
                            style="display:inline-block; padding:10px 20px; background:#3b82f6; color:white; text-decoration:none; border-radius:6px;">
                            Verify Email
                         </a>
                   
                         <p style="margin-top:20px; font-size:12px; color:gray;">
                           If you didn’t request this, you can ignore this email.
                         </p>
                       </div>`
    });
};

export const sendResetPasswordEmail = async (
    email,
    token,
    name
) => {
    await resend.emails.send({
        from: "Acme <onboarding@resend.dev>",
        to: email,
        subject: "reset password Email",
        html: `<div style="font-family: Arial, sans-serif; padding: 20px;">
             
                         <h2>Hello ${name},</h2>
                         <h3>Reset your password</h3>
                         <p>Click the button below to reset your password:</p>
                   
                         <a href="http://localhost:${process.env.PORT}/api/v1/auth/reset-password/${token}" 
                            style="display:inline-block; padding:10px 20px; background:#3b82f6; color:white; text-decoration:none; border-radius:6px;">
                            Reset password
                         </a>
                   
                         <p style="margin-top:20px; font-size:12px; color:gray;">
                           If you didn’t request this, you can ignore this email.
                         </p>
                       </div>`
    });
};