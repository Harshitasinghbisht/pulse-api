import { prisma } from "../config/prisma";
import { hasPermission } from "../services/hasPermission";
import { getWorkspaceRole } from "../services/hasPermission.js"

export const authorizeCollection=(action)=>{
    return async(req,res,next)=>{
        try {
            const {collectionId}=req.params;
            const userId=req.user.id;

              if(!collectionId){
                return res.status(400).json({
                    success:false,
                    message:"Invalid collectionId"
                })
            }
            if(!userId){
                return res.status(401).json({
                    success:false,
                    message:"User not authenticated"
                })
            }
            const collection =await prisma.collection.findUnique({
                where:{id:collectionId},
                include:{
                    workspace:{
                        include:{
                            workspaceMembers:{
                                where:{
                                    userId
                                },
                                select:{
                                    userId:true,
                                    role:true
                                }
                            }
                        }
                    }
                }
            })
            if(!collection){
                return res.status(404).json({
                    success:false,
                    message:"collection not found"
                })
            }
           const role=getWorkspaceRole(collection.workspace,userId);
            if (!role) {
               return res.status(403).json({
                   success: false,
                   message: "You are not a member of this workspace"
               });
                      }
            const allowed =hasPermission(collection.workspace,userId,action);
            if(!allowed){
                  return res.status(403).json({
                    success:false,
                    message:"You don't have permission to perform this action"
                })
            }
            
            req.collection=collection;
            req.workspaceRole=role;

            next();

        } catch (error) {
             console.error("middleware collection",error)
            return res.status(500).json({
                    success:false,
                    message:"Internal server error"
                })
        }
    }
}