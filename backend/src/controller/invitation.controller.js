import { prisma } from "../config/prisma";
import crypto from "crypto";
import { sendInvitationEmail } from "../services/emailService.js";


export const sendInvitation = async (req, res) => {
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

    // 2. Validate workspace
    if (!workspace) {
        return res.status(400).json({
            success: false,
            message: "Workspace not found",
        });
    }

    try {
        // If req.workspace contains the whole workspace object
        const workspaceId = workspace.id;

        // 3. Get sender's membership/role
        const senderMembership = await prisma.workspaceMember.findFirst({
            where: {
                userId: senderId,
                workspaceId: workspaceId,
            },
        });

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

        // 5. Check whether the invited email already belongs to a user
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });

        // 6. If user exists, check whether already a workspace member
        if (user) {
            const alreadyMember = await prisma.workspaceMember.findFirst({
                where: {
                    userId: user.id,
                    workspaceId: workspaceId,
                },
            });

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
                    role: inviteRole,
                    expiresAt: expiresAt,
                },
            });
        }

        // 11. Get sender information
        const sender = await prisma.user.findUnique({
            where: {
                id: senderId,
            },
        });

        // 12. Send invitation email
        await sendInvitationEmail(
            email,
            invitation.token,
            invitation.role,
            sender.name,
            workspace.name,
            user?.name
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