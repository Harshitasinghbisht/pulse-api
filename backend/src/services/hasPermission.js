export const getWorkspaceRole=(workspace,userId)=>{
    const member=workspace.workspaceMembers.find((member)=>member.userId===userId);
    return member?.role || null;
}

export const workspacePermission={
  viewWorkspace:   ["OWNER", "MEMBER","VIEWER","ADMIN"],
  updateWorkspace: ["OWNER"],
  deleteWorkspace: ["OWNER"],
  inviteMember:    ["OWNER"],
  removeMember:    ["OWNER"],
};

export const hasPermission=(workspace,userId,action)=>{
    const role=getWorkspaceRole(workspace,userId)
    if(!role){
        return false
    }

    return workspacePermission[action].includes(role);
}