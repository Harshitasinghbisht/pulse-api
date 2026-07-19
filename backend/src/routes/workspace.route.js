import express from "express";
import {authenticate} from "../middleware/auth.middleware.js";
import { createWorkspace,getMyWorkspaces,getWorkspaceById,deleteWorkspace,updateWorkspace } from "../controller/workspace.controller.js";
import authorizeWorkspace from "../middleware/authorizeWorkspace.middleware.js";

const workspaceRouter=express.Router();

workspaceRouter.post("/",authenticate,createWorkspace);
workspaceRouter.put("/:workspaceId",authenticate,authorizeWorkspace("updateWorkspace"),updateWorkspace);
workspaceRouter.delete("/:workspaceId",authenticate,authorizeWorkspace("deleteWorkspace"),deleteWorkspace);

workspaceRouter.get("/",authenticate,getMyWorkspaces);
workspaceRouter.get("/:workspaceId",authenticate,authorizeWorkspace("viewWorkspace"),getWorkspaceById);