import { prisma } from "../config/prisma.js";
import crypto from "crypto";
import { sendInvitationEmail } from "../services/emailService.js";


export const sendInvitation = async (req, res) => {
    console.log("A - controller started");
    const email = req.body.email?.trim().toLowerCase();
    const inviteRole = req.body.role;

    const workspace = req.workspace;
    const senderId = req.user.id;

    // 1. Validate email
    if (!email) {
        return res.status(400).json({
            success: false,
            message: "Email is required",
        });
    }
   console.log("C - email validated");
    // 2. Validate workspace
    if (!workspace) {
        return res.status(400).json({
            success: false,
            message: "Workspace not found",
        });
    }
 console.log("D - workspace validated");
    try {
        // If req.workspace contains the whole workspace object
        const workspaceId = workspace.id;

          console.log("E - before sender membership query");

        // 3. Get sender's membership/role
        const senderMembership = await prisma.workspaceMember.findFirst({
            where: {
                userId: senderId,
                workspaceId: workspaceId,
            },
        });

        console.log("F - sender membership query finished");
        if (!senderMembership) {
            return res.status(403).json({
                success: false,
                message: "You are not a member of this workspace",
            });
        }

        // 4. Only OWNER and ADMIN can invite
        if (
            senderMembership.role !== "OWNER" &&
            senderMembership.role !== "ADMIN"
        ) {
            return res.status(403).json({
                success: false,
                message: "Access denied",
            });
        }
console.log("G - before user query");
        // 5. Check whether the invited email already belongs to a user
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });
        console.log("G - finished user query");

        // 6. If user exists, check whether already a workspace member
        if (user) {
            const alreadyMember = await prisma.workspaceMember.findFirst({
                where: {
                    userId: user.id,
                    workspaceId: workspaceId,
                },
            });
  console.log("after the already member")
            if (alreadyMember) {
                return res.status(409).json({
                    success: false,
                    message: "User is already a member of this workspace",
                });
            }
        }

        // 7. Check for an existing invitation
        const existingInvitation = await prisma.invitation.findUnique({
            where: {
                workspaceId_email: {
                    workspaceId: workspaceId,
                    email: email,
                },
            },
        });
        console.log("after existingInviattion")

        // 8. Generate invitation details
        const token = crypto.randomBytes(32).toString("hex");

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        let invitation;

        // 9. Handle existing invitation
        if (existingInvitation) {
            // Already pending
            if (existingInvitation.status === "PENDING") {
                return res.status(409).json({
                    success: false,
                    message: "Invitation already sent to this email",
                });
            }

            // Already accepted
            if (existingInvitation.status === "ACCEPTED") {
                return res.status(409).json({
                    success: false,
                    message: "Invitation has already been accepted",
                });
            }

            // EXPIRED or DECLINED → reuse invitation
            invitation = await prisma.invitation.update({
                where: {
                    workspaceId_email: {
                        workspaceId: workspaceId,
                        email: email,
                    },
                },
                data: {
                    token: token,
                    role: inviteRole,
                    status: "PENDING",
                    expiresAt: expiresAt,
                },
            });
        } else {
            // 10. Create new invitation
            invitation = await prisma.invitation.create({
                data: {
                    email: email,
                    token: token,
                    workspaceId: workspaceId,
                    invitedById: senderId,
                    role: inviteRole,
                    expiresAt: expiresAt,
                },
            });
        }
console.log("after creation of invitation")
        // 11. Get sender information
        const sender = await prisma.user.findUnique({
            where: {
                id: senderId,
            },
        });

        console.log("after sender")

        // 12. Send invitation email
        await sendInvitationEmail(
            email,
            invitation.token,
            invitation.role,
            sender.name,
            workspace.name,
            user?.name || "there"
        );

        // 13. Response
        return res.status(201).json({
            success: true,
            message: "Invitation sent successfully",
        });

    } catch (error) {
        console.error("Send invitation error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const getInvitationByToken=async(req,res)=>{
    const {token}=req.params;
    
    if(!token){
        return res.status(400).json({
            success:false,
            message:"tokenis required"
        })
    }

    try {
        const existingInvitation=await prisma.invitation.findUnique({
            where:{token:token},
             include: {
        workspace: {
            select: {
                id: true,
                name: true
            }
        }
    }
        })

        if(!existingInvitation){
        return res.status(404).json({
            success:false,
            message:"Invitation not found"
        })
        }
        if(existingInvitation.status==="ACCEPTED"){
             return res.status(409).json({
            success:false,
            message:"Invitation already accepted"
        })
        }
        else if(existingInvitation.status==="DECLINED"){
             return res.status(409).json({
            success:false,
            message:"Invitation already declined"
        })
        }
        else if(existingInvitation.status==="EXPIRED"){
             return res.status(410).json({
            success:false,
            message:"Invitation already expired"
        })
        }
       
        if(new Date()>existingInvitation.expiresAt){
            await prisma.invitation.update({
                where:{token:token},
                data:{
                    status:"EXPIRED"
                }
            })
             return res.status(410).json({
            success:false,
            message:"Invitation already expired"
        })
        }
        return res.status(200).json({
            success:true,
            message: "Invitation pending acceptance",
            invitation: {
                email: existingInvitation.email,
                role: existingInvitation.role,
                status: existingInvitation.status,
                expiresAt: existingInvitation.expiresAt,
                workspace: existingInvitation.workspace
            }
        })
       
    } catch (error) {
        console.error("Get invitation error:", error);
        return res.status(500).json({
            success:false,
            message:"Interbnal server error"
        })
    }
}

export const acceptInvitation =async(req,res)=>{
    const {token}=req.params;
    if(!token){
        return res.status(400).json({
            success:false,
            message:"Token is required"
        })
    }
    const userId=req.user.id;
    const email=req.user.email.trim().toLowerCase();

    if(!userId && !email){
        return res.status(400).json({
            success:false,
            message:"email and userId not found"
        })
    }
    try {
        const user=await prisma.user.findUnique({
            where:{
                id:userId
            }
        })

        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found"
            })
        }

        const existingInvitation=await prisma.invitation.findUnique({
            where:{token:token}
        })
        if(!existingInvitation){
            return res.status(404).json({
                success:false,
                message:"invitation not found"
            })
        }
        if(user.email.toLowerCase() !== existingInvitation.email.toLowerCase()){
            return res.status(403).json({
                success:false,
                message:"the email was send to the ddifferent email addres"
            })
        }
        if(existingInvitation.status==="ACCEPTED"){
            return res.status(409).json({
                success:false,
                message:"the invitaion already accepted"
            })
        }
        else if(existingInvitation.status==="DECLINED"){
            return res.status(409).json({
                success:false,
                message:"the invitaion already decliend"
            })
        }
        else if(existingInvitation.status==="EXPIRED"){
            return res.status(410).json({
                success:false,
                message:"the invitaion already expired"
            })
        }
        if(new Date()>existingInvitation.expiresAt){
            await prisma.invitation.update({
                where:{
                    token:token
                },
                data:{
                    status:"EXPIRED"
                }
            })
            return res.status(410).json({
                success:false,
                message:"the invitaion already expired"
            })
        }
        const alreadyMember=await prisma.workspaceMember.findFirst({
            where:{
                userId:user.id,
                workspaceId:existingInvitation.workspaceId
            }
        })
        if(alreadyMember){
            return res.status(409).json({
                success:false,
                message:"User is alreaddy a member"
            })
        }

        await prisma.$transaction(async(tx)=>{
            const member=await tx.workspaceMember.create({
                data:{
                    userId:user.id,
                    workspaceId:existingInvitation.workspaceId,
                    role:existingInvitation.role
                }
            })

            const updatedInvitation=await tx.invitation.update({
                where:{
                    id:existingInvitation.id
                },
                data:{
                  status:"ACCEPTED"
                }
            })
            return {member , updatedInvitation}
        })

        return res.status(200).json({
            success:true,
            message:"Invitaion accepted succesfully",
            workspace:{
             workspaceId:existingInvitation.workspaceId,
             role:existingInvitation.role
            }
        })
    } catch (error) {
         console.error("accept invitation error:", error);
        return res.status(500).json({
            success:false,
            message:"Interbnal server error"
        })
    }
}

export const cancelInvitation=async(req,res)=>{
    const {id}=req.params;
    if(!id){
        return res.status(400).json({
            success:false,
            message:"id is required"
        })
    }
    const userId=req.user.id;
    try {
        const invitation=await prisma.invitation.findUnique({
            where:{
                id:id
            }
        })
        if(!invitation){
             return res.status(404).json({
            success:false,
            message:"invitation not found"
        })
        }
        const member=await prisma.workspaceMember.findUnique({
          where:{
            userId_workspaceId: {
            userId: userId,
            workspaceId: invitation.workspaceId
        }
          }
        })
        if(!member){
            return res.status(403).json({
                success:false,
                message:"member not exist"
            })
        }
        if(member.role!=="ADMIN" && member.role!=="OWNER"){
           return res.status(403).json({
                success:false,
                message:"access denied"
            })  
        }
        if(invitation.status==="ACCEPTED"){
             return res.status(409).json({
                success:false,
                message:"invitation already accepted"
            })
        }
        else if(invitation.status==="DECLINED"){
             return res.status(409).json({
                success:false,
                message:"invitation already declined"
            })
        }
        else if(invitation.status==="EXPIRED"){
             return res.status(410).json({
                success:false,
                message:"invitation request expired"
            })
        }
        if(new Date()>invitation.expiresAt){
            await prisma.invitation.update({
                where:{
                    id:invitation.id
                },
                data:{
                    status:"EXPIRED"
                }
            })
             return res.status(410).json({
                success:false,
                message:"invitation request expired"
            })
        }
        await prisma.invitation.update({
            where:{
                id:invitation.id
            },
            data:{
                status:"DECLINED"
            }
        })
        return res.status(200).json({
            success:true,
            message:"Invitation cancelled successfully",
            invitation: {
            id: invitation.id,
            status: "DECLINED"
    }
        })
    } catch (error) {
        console.error("error in cancle invitation ",error)
         return res.status(500).json({
                success:false,
                message:"Internal server error"
            })
    }
}