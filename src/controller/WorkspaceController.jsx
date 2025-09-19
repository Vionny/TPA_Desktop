import { addDoc, arrayRemove, arrayUnion, collection, deleteDoc, doc, getDoc, onSnapshot, query, updateDoc, where} from "firebase/firestore";
import { useEffect, useState } from "react";
import { getfstore } from "../fbase/fbaseimport";
import { UpdateJoinedWorkspace, UserNotificationUpdate } from "./UserController";


export const workspaceAddress = collection(getfstore,'Workspaces')

export function CreateNewWorkspace(userid,name,desc){
    
    addDoc(workspaceAddress,{
       WorkspaceName :name,
       WorkspaceDescription :desc,
       WorkspaceVisibility : 'public',
       WorkspaceAdminID : arrayUnion(userid),
       WorkspaceMemberID : arrayUnion()
    }).then((doc)=>{
        UpdateJoinedWorkspace(userid,doc.id)
    })
    
}

export function AddWorkspaceMember(userid,workspaceid){
    
    updateDoc( doc(getfstore, "Workspaces", workspaceid), {
        WorkspaceMemberID: arrayUnion(userid)
    })
    getDoc(doc(getfstore, "Workspaces", workspaceid)).then((doc)=>{
        console.log(doc.data())
        let members = doc.data().WorkspaceMemberID
        console.log(members)
        members.map((memberid)=>{
            if(memberid !== userid){
                UserNotificationUpdate(userid,workspaceid,memberid)
            }
        })
        UpdateJoinedWorkspace(userid,workspaceid)
            
        
    }
    )
}

export function setWorkspaceVisibility(workspaceid,vis){
    updateDoc( doc(getfstore, "Workspaces", workspaceid), {
        WorkspaceVisibility : vis
    })
}

export function GrantAdmin(userid,workspaceid){
   
    const [workspace,setWorkspace] = useState({})
    const [loadWs, setLoadWs] = useState(true);
    const [workspacemembers,setWorkspaceMembers] = useState({})
    useEffect(()=>{
        getDoc(doc(getfstore,'Workspaces',workspaceid)).then((doc)=>{
            const workspace1 = doc.data()
            setWorkspace(workspace1)
            setWorkspaceMembers(workspace1.WorkspaceMemberID)
            setLoadWs(false)
        })
    },[!loadWs])

    
    if(!loadWs){
        setWorkspaceMembers(workspacemembers.splice(workspacemembers.indexOf(userid),1))
        updateDoc(doc(getfstore, "Workspaces", workspaceid), {
            WorkspaceAdminID: arrayUnion(userid),
            WorkspaceMemberID: workspacemembers
        })
    }
    
    
}
  
  export function RevokeAdmin(userid,workspaceid){
    // console.log(wsss.includes(userid))
    // console.log(wsss)
   
    
    const [workspace,setWorkspace] = useState({})
    const [loadWs, setLoadWs] = useState(true);
    const [workspaceadmins,setWorkspaceAdmins] = useState({})
    useEffect(()=>{
        getDoc(doc(getfstore,'Workspaces',workspaceid)).then((doc)=>{
            const workspace1 = doc.data()
            setWorkspace(workspace1)
            setWorkspaceAdmins(workspace1.WorkspaceMemberID)
            setLoadWs(false)
        })
    },[!loadWs])

    
    if(!loadWs){
        setWorkspaceAdmins(workspaceadmins.splice(workspaceadmins.indexOf(userid),1))
        updateDoc(doc(getfstore, "Workspaces", workspaceid), {
            WorkspaceMemberID: arrayUnion(userid),
            WorkspaceAdminID: workspaceadmins
        })
    }
  }

  export function RemoveMember(userid,workspaceid){
    const [workspace,setWorkspace] = useState({})
    const [loadWs, setLoadWs] = useState(true);
    const [workspaceadmins,setWorkspaceAdmins] = useState({})
    useEffect(()=>{
        getDoc(doc(getfstore,'Workspaces',workspaceid)).then((doc)=>{
            const workspace1 = doc.data()
            setWorkspace(workspace1)
            setWorkspaceAdmins(workspace1.WorkspaceMemberID)
            setLoadWs(false)
        })
    },[!loadWs])

    
    if(!loadWs){
        setWorkspaceAdmins(workspaceadmins.splice(workspaceadmins.indexOf(userid),1))
        updateDoc(doc(getfstore, "Workspaces", workspaceid), {
            WorkspaceMemberID: arrayUnion(userid),
            WorkspaceAdminID: workspaceadmins
        })
    }
  }

export function LeaveWorkspace(userid,workspaceid,amountUsers){
    
    
    updateDoc(doc(getfstore, "Workspaces", workspaceid),{
            
        WorkspaceAdminID : arrayRemove(userid),
        WorkspaceMemberID:arrayRemove(userid)
    }).then(
        updateDoc(doc(getfstore, "Users",userid),{
            JoinedWorkspaces : arrayRemove(workspaceid)
        })
    )
    if(amountUsers===1){
        deleteDoc(doc(getfstore, "Workspaces", workspaceid))
    }
}