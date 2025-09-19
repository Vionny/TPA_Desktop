import { addDoc, arrayUnion, collection, doc, updateDoc } from "firebase/firestore";
import { getfstore } from "../fbase/fbaseimport";

export const usersAddress = collection(getfstore,'Users')

export function createNewUser(userid,username,email,password){
    addDoc(usersAddress,{
        UserID : userid,
        Username : username,
        UserEmail : email,
        UserPassword : password
    })
    
}
export function UpdateJoinedWorkspace(userid,workspaceid){

    updateDoc(doc(getfstore,'Users',userid),{
        JoinedWorkspaces: arrayUnion(workspaceid)
    })
}

export function UserNotificationUpdate(userid,workspaceid,memberid){
    updateDoc(doc(getfstore,"Users",memberid),{
        Notification : arrayUnion(userid +" has joined workspace with id : "+workspaceid)
    })
}
export function UserInviteNotification(memberid,messages){
    // console.log(memberid)
    console.log(memberid)
    updateDoc(doc(getfstore,"Users",memberid),{
        Notification : arrayUnion(messages)
    })
}

export function UpdateUserFreq(freq,userid){
   
    updateDoc(doc(getfstore,"Users",userid),{
        NotifFrequency : freq
    })
}
export function UpdateUserJoinedBoardandOwnedBoard(boardid,userid){

    updateDoc(doc(getfstore,'Users',userid),{
        JoinedBoard: arrayUnion(boardid),
        OwnedBoard : arrayUnion(boardid)
    })
}
