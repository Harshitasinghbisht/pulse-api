import { prisma } from "../config/prisma";

export const createCollection=async(req,res)=>{
const {workspaceId}=req.params;
const userId=req.user.id;
const {name}=req.body;
const {description}=req.body;

if (!name || typeof name !== "string" || !name.trim()){
  return res.status(403).json({
        success:false,
        message:"Collection name is required"
    })
}
if(!workspaceId){
    return res.status(400).json({
        success:false,
        message:"Workspace Id is required"
    })
}
const collectionName = name.trim();
try {
 const isMember=await prisma.workspaceMember.findUnique({
   
 where: {
    userId_workspaceId: {
      userId,
      workspaceId
    }
  }
 })   
 if(!isMember){
    return res.status(403).json({
        success:false,
        message:"User is not a member of this workspace"
    })
 }
 
 if(isMember.role!=="OWNER"  && isMember.role!=="ADMIN"){
 return res.status(403).json({
        success:false,
        message:"acccess denied"
    })
 }
 const existingCollection=await prisma.collection.findUnique({
    where:{
        workspaceId_name: {
         workspaceId,
         name: name.trim()
    }
    }
 })
 if(existingCollection){
     return res.status(409).json({
        success:false,
        message:"the collection name already exist in the workspace"
    })
 }

 const newCollection=await prisma.collection.create({
    data:{
        name:collectionName,
        description:description?.trim() || null,
        workspaceId,
        createdById:userId,
    }
 })
  return res.status(201).json({
    success:true,
    message:"collection created successfully",
    newCollection
  })

} catch (error) {
    console.error("create collection",error);
     return res.status(500).json({
        success:false,
        message:"Internal server error"
    })
}
}

export const getAllCollection=async(req,res)=>{
 const {workspaceId}=req.params;
 const userId=req.user.id;
 if(!workspaceId){
    return res.status(400).json({
        success:false,
        message:"workspace id is required"
    })
 }
try {
    const isMember=await prisma.workspaceMember.findUnique({
        where:{
            userId_workspaceId:{
                userId,
                workspaceId
            }
        }
    })
     if(!isMember){
    res.status(403).json({
        success:false,
        message:"user is not a member of the workspace"
    })
 }
 const collecctions=await prisma.collection.findMany({
    where:{
        workspaceId
    }
 })
 res.status(200).json({
    success:true,
    message:"collection found successfully",
    collecctions
 })
} catch (error) {
    console.error("get all collection",error)
    res.status(500).json({
    success:false,
    message:"internal server error",
 })
}
}

export const getSingleCollection = async (req, res) => {
  const { collectionId } = req.params;

  if (!collectionId) {
    return res.status(400).json({
      success: false,
      message: "Collection id is required"
    });
  }

  try {
    const collection = req.collection;

    return res.status(200).json({
      success: true,
      message: "Collection fetched successfully",
      collection
    });

  } catch (error) {
    console.error("Get single collection:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const updateCollection = async (req, res) => {
  const { collectionId } = req.params;
  const { name, description } = req.body;

  if (!collectionId) {
    return res.status(400).json({
      success: false,
      message: "Collection id is required"
    });
  }

  if (name === undefined && description === undefined) {
    return res.status(400).json({
      success: false,
      message: "Provide name or description to update"
    });
  }

  try {
    // Collection is already fetched by authorizeCollection middleware
    const collection = req.collection;

    const data = {};

    if (name !== undefined) {
      if (typeof name !== "string") {
        return res.status(400).json({
          success: false,
          message: "Name must be a string"
        });
      }

      const trimmedName = name.trim();

      if (!trimmedName) {
        return res.status(400).json({
          success: false,
          message: "Collection name cannot be empty"
        });
      }

      data.name = trimmedName;
    }

    if (description !== undefined) {
      if (typeof description !== "string") {
        return res.status(400).json({
          success: false,
          message: "Description must be a string"
        });
      }

      data.description = description.trim();
    }

    const nameUnchanged =
      data.name === undefined || data.name === collection.name;

    const descriptionUnchanged =
      data.description === undefined ||
      data.description === collection.description;

    if (nameUnchanged && descriptionUnchanged) {
      return res.status(409).json({
        success: false,
        message: "No changes detected"
      });
    }

    const updatedCollection = await prisma.collection.update({
      where: {
        id: collectionId
      },
      data
    });

    return res.status(200).json({
      success: true,
      message: "Collection updated successfully",
      collection: updatedCollection
    });

  } catch (error) {
    console.error("update collection", error);

    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "A collection with this name already exists"
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const deleteCollection=async(req,res)=>{
const {collectionId}=req.params;
if(!collectionId){
    return res.status(400).json({
        success:false,
        message:"collection id is required"
    })
}
try {
  
    await prisma.collection.delete({
        where:{
            id:collectionId
        }
    })
     return res.status(201).json({
            success:false,
            message:"collection deleted successfully"
        })
} catch (error) {
    console.error("delete collection",error)
    return res.status(500).json({
            success:false,
            message:"Internal server error"
        })
}
}