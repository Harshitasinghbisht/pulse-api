import express from "express";
import { authenticate } from "../middleware/auth.middleware";
import {authorizeCollection} from "../middleware/collection.middleware";
import { createRequest, getAllRequest, getSingleRequest, updateRequest,deleteRequest } from "../controller/request.comtroller";

const requestRouter=express.Router();

requestRouter.post("/collections/:collectionId/request",authenticate,authorizeCollection("CREATE"),createRequest);
requestRouter.get("/collections/:collectionId/request",authenticate,authorizeCollection("VIEW"),getAllRequest);
requestRouter.get("/:requestId",authenticate,authorizeCollection("VIEW"),getSingleRequest);
requestRouter.patch("/:requestId",authenticate,authorizeCollection("UPDATE"),updateRequest);
requestRouter.delete("/:requestId",authenticate,authorizeCollection("DELETE"),updateRequest);

export default requestRouter;