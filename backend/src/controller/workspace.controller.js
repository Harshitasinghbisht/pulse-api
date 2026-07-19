import { prisma } from "../config/prisma";

export const createWorkspace=async(req,res)=>{
    const name=req.body.name?.trim();
    const description=req.body.description?.trim() || null;
    if(!name){
        return res.status(400).json({
            success:false,
            message:"Workspace name is required"
        })
    }

    const userId = req.user.id;
    try {
        const workspace=await prisma.workspace.create({
            data:{
                name,
                description,
                workspaceMembers:{
                    create:{
                        userId:userId,
                        role:"OWNER"
                    }
                },
                 include: {
                         workspaceMembers: true
                       }
            }
        });
         return res.status(201).json({
                     success:true,
                     message:"workspace created successfully",
                     workspace
                 })


    } catch (error) {
        console.error("createWorkspace error",error);
        return res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
}

export const getMyWorkspaces=async(req,res)=>{
const userId=req.user.id;

try {
    const allWorkspace=await prisma.workspace.findMany({
       where:{
        workspaceMembers:{
            some:{
                userId
            }
        }
       },
       include:{
        workspaceMembers:{
            where:{
                userId
            },
             select: {
        role: true,
      },
        }
       }
    })

    return res.status(200).json({
        success:true,
        message:"Featched all workspace",
        allWorkspace
    })
} catch (error) {
    console.error("allworkspace error",error)
     return res.status(500).json({
        success:false,
        message:"Internal server error",
        
    })
}
}

export const getWorkspaceById = async (req, res) => {
    
    const userId = req.user.id;
    const workspace=req.workspace;

    try {

        if (!workspace) {
            return res.status(404).json({
                success: false,
                message: "Workspace not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Workspace fetched successfully",
            workspace,
        });
    } catch (error) {
        console.error("getWorkspaceById error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const updateWorkspace=async(req,res)=>{
    const name=req.body.name?.trim();
    const description=req.body.description?.trim();
    const userId=req.user.id;
    const {workspaceId}=req.params;
    const workspace=req.workspace;
   if (
    workspace.name === name &&
    workspace.description === description
) {
    return res.status(400).json({
        success: false,
        message: "No changes detected",
    });
}
  try {
    
    if (!workspace) {
    return res.status(404).json({
        success: false,
        message: "Workspace not found",
    });
}

    if(workspace.name===name){
         return res.status(400).json({
        success: false,
        message: "Workspace name is unchanged"
    });
    }
    const updatedWorkspace=await prisma.workspace.update({
        where:{
            id:workspaceId
        },
        data:{
            name:name,
            description:description
        }
    })
    return res.status(200).json({
        success: true,
        message: "Workspace upadted successfully",
        updatedWorkspace
    });
  } catch (error) {
    console.error("updateWorkspace error",error)
    return res.status(500).json({
        success: false,
        message: "Internal server error"
    });
  }
}

export const deleteWorkspace=async(req,res)=>{
    const {workspaceId}=req.params;
     const userId=req.user.id;
     const workspace=req.workspace;
    try {
    if(!workspace){
        return res.status(404).json({
            success:false,
            message:"workspace not found"
        })
    }

    await prisma.workspace.delete({
        where:{
            id:workspaceId
        }
    })
     return res.status(200).json({
            success:true,
            message:"workspace deleted successfully"
        })
    } catch (error) {
        console.error("deleteWorkspace error",error)
         return res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
}
