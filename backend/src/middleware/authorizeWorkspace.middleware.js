import {prisma} from "../config/prisma.js"
import {hasPermission} from "../services/hasPermission.js"

export const authorizeWorkspace=(action)=>{
    return async(req,res,next)=>{
        try {
            const {workspaceId}=req.params;
            const userId=req.user.id;

            if(!workspaceId){
                return res.status(404).json({
                    success:false,
                    message:"Invalid workspace ID."
                })
            }
     const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
    include: {
        members: {
            where: {
                userId,
            },
            select: {
                userId: true,
                role: true,
            },
        },
    },
});
      if(!workspace){
                return res.status(404).json({
                    success:false,
                    message:"workspace unauthorized"
                })
            }
            const allowed =hasPermission(workspace,userId,action);
            if(!allowed){
                return res.status(403).json({
                    success:false,
                    message:"You don't have permission to perform this action."
                })
            }

           const role = getWorkspaceRole(workspace, userId);
           
           req.workspace = workspace;
           req.workspaceRole = role;

        } catch (error) {
            console.error("middleware workspace",error)
            return res.status(500).json({
                    success:false,
                    message:"Internal server error"
                })
        }
    }
}