import express from "express";
import { authorizeWorkspace } from "../middleware/authorizeWorkspace.middleware.js";
import {authenticate} from "../middleware/auth.middleware.js";
import { createCollection,getAllCollection,getSingleCollection,updateCollection,deleteCollection } from "../controller/collection.controller.js";

const collectionRouter=express.Router();

collectionRouter.post("/:workspaceId",authenticate,authorizeWorkspace("createCollection"),createCollection);  //to create the collection
collectionRouter.get("/:workspaceId",authenticate,authorizeWorkspace("viewCollection"),getAllCollection)    // get all collection
collectionRouter.get("/:collectionId",authenticate,authorizeCollection("viewCollection"),getSingleCollection)   //get 1 collection
collectionRouter.patch("/:collectionId",authenticate,authorizeCollection("updateCollection"),updateCollection)  //update collection
collectionRouter.delete("/:collectionId",authenticate,authorizeCollection("deleteCollection"),deleteCollection) //delete collection

export default collectionRouter;