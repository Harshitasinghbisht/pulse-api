import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

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

export const sendInvitationEmail = async (
    email,
    token,
    role,
    invitedBy,
    workspaceName, // renamed to prevent confusion
    name
) => {
    try {
        const { data, error } = await resend.emails.send({
            from: "Acme <onboarding@resend.dev>",
            to: email,
            subject: "Invitation",
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>Hello ${name},</h2>
                    <h3>You have been invited to join:</h3>
                    <p>Workspace: ${workspaceName}<br/>
                    Role: ${role}<br/>
                    Invited by: ${invitedBy}</p>
                    <p>Click the button to accept the invitation</p>
                    <a href="http://localhost:${process.env.PORT || 5000}/api/v1/invitation/${token}" 
                       style="display:inline-block; padding:10px 20px; background:#3b82f6; color:white; text-decoration:none; border-radius:6px;">
                       Accept Invitation
                    </a>
                </div>
            `
        });

        if (error) {
            console.error("Resend error:", error);
        }
        return data;
    } catch (err) {
        console.error("Failed to send email via Resend:", err);
    }
};