export const getWorkspaceRole=(workspace,userId)=>{
    const member=workspace.workspaceMembers.find((member)=>member.userId===userId);
    return member?.role || null;
}

export const workspacePermission={
  viewWorkspace:   ["OWNER", "EDITOR","VIEWER","ADMIN"],
  updateWorkspace: ["OWNER"],
  deleteWorkspace: ["OWNER"],
  inviteMember:    ["OWNER"],
  removeMember:    ["OWNER"],

    // Collection permissions
  createCollection: ["OWNER", "ADMIN"],
  viewCollection: ["OWNER", "ADMIN", "EDITOR", "VIEWER"],
  updateCollection: ["OWNER", "ADMIN", "EDITOR"],
  deleteCollection: ["OWNER", "ADMIN"],
};

export const hasPermission=(workspace,userId,action)=>{
    const role=getWorkspaceRole(workspace,userId)
    if(!role){
        return false
    }

    return workspacePermission[action]?.includes(role)?? false;
}