import express from "express";
import {authenticate} from "../middleware/auth.middleware.js";

const invitationRouter=express.Router();

invitationRouter.post("/",authenticate);
invitationRouter.get("/:token",authenticate);
invitationRouter.post("/:token/accept",authenticate);
invitationRouter.delete("/:id",authenticate);


