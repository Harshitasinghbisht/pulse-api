import express from "express";
import { authorizeWorkspace } from "../middleware/authorizeWorkspace.middleware.js";
import {authenticate} from "../middleware/auth.middleware.js";
import { sendInvitation ,getInvitationByToken,acceptInvitation,cancelInvitation } from "../controller/invitation.controller.js";

const invitationRouter=express.Router();

invitationRouter.post("/:workspaceId",authenticate,authorizeWorkspace("inviteMember"),sendInvitation);
invitationRouter.get("/:token",getInvitationByToken);
invitationRouter.post("/:token/accept",authenticate,acceptInvitation);
invitationRouter.delete("/:id",authenticate,cancelInvitation);


export default invitationRouter;