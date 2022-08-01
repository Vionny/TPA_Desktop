import { addDoc, arrayRemove, arrayUnion, collection, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { getfstore } from "../fbase/fbaseimport";
import { UpdateUserJoinedBoardandOwnedBoard } from "./UserController";

export const boardAddress = collection(getfstore,'Boards')

export function CreateNewBoard(name,workspaceid,userid){
    addDoc(boardAddress,{
        WorkspaceID : workspaceid,
        BoardName: name,
        BoardStatus :'open',
        BoardVisibility : 'public',
        BoardAdminID : arrayUnion(userid)
     }).then((doc)=>{
        console.log(doc.id,userid)
        UpdateUserJoinedBoardandOwnedBoard(doc.id,userid)
     })
}

export function LeaveBoard(userid,boardid,amountUsers){
    
    
   updateDoc(doc(getfstore, "Boards", boardid),{
           
       BoardAdminID : arrayRemove(boardid),
       BoardMemberID:arrayRemove(boardid)
   }).then(
       updateDoc(doc(getfstore, "Users",userid),{
           JoinedBoard : arrayRemove(boardid),
           OwnedBoard : arrayRemove(boardid)
       })
   )
   if(amountUsers===1){
       deleteDoc(doc(getfstore, "Workspaces", boardid))
   }
}

export function setBoardVisibility(boardid,vis){
   updateDoc( doc(getfstore, "Boards", boardid), {
      BoardVisibility : vis
   })
}

export function setBoardStatus(boardid,status){
   updateDoc(doc(getfstore, "Boards", boardid),{
      BoardStatus : status
   })
}