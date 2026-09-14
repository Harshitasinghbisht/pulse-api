import express from "express";
import { authorizeWorkspace } from "../middleware/authorizeWorkspace.middleware.js";
import {authenticate} from "../middleware/auth.middleware.js";

const collectionRouter=express.Router();

collectionRouter.post("/:workspaceId",authenticate,authorizeWorkspace("createCollection"));  //to create the collection
collectionRouter.get("/:workspaceId",authenticate,authorizeWorkspace("viewCollection"))    // get all collection
collectionRouter.get("/:collectionId",authenticate,)   //get 1collection
collectionRouter.patch("/:collectionId",authenticate,)  //update collection
collectionRouter.delete("/:collectionId",authenticate,) //delete collection

export default collectionRouter;