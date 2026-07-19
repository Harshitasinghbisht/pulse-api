export const getWorkspaceRole=(workspace,userId)=>{
    const member=workspace.workspaceMembers.find((member)=>member.userId===userId);
    return member?.role || null;
}

export const boardPermission={
  viewWorkspace: ["owner", "member","viewer","admin"],
  updateWorkspace: ["owner"],
  deleteWorkspace: ["owner"],
  inviteMember: ["owner"],
  removeMember: ["owner"],
};

export const getWorkspaceRole=(workspace,userId,action)=>{
    const role=getBoardRole(workspace,userId)
    if(!role){
        return false
    }

    return boardPermission[action].includes(role);
}