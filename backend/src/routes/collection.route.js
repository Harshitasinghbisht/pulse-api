import express from "express";
import { authorizeWorkspace } from "../middleware/authorizeWorkspace.middleware.js";
import {authenticate} from "../middleware/auth.middleware.js";
import {authorizeCollection}  from "../middleware/collection.middleware.js"
import { createCollection,getAllCollection,getSingleCollection,updateCollection,deleteCollection } from "../controller/collection.controller.js";

const collectionRouter=express.Router();

collectionRouter.post("/workspace/:workspaceId",authenticate,authorizeWorkspace("createCollection"),createCollection);
collectionRouter.get("/workspace/:workspaceId",authenticate,authorizeWorkspace("viewCollection"),getAllCollection);   
collectionRouter.get("/:collectionId", authenticate,authorizeCollection("viewCollection"),getSingleCollection);
collectionRouter.patch("/:collectionId",authenticate,authorizeCollection("updateCollection"),updateCollection);  
collectionRouter.delete("/:collectionId",authenticate,authorizeCollection("deleteCollection"),deleteCollection); 

export default collectionRouter;