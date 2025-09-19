import { UseCurrUser } from "../LoginRegister/Auth";
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from "react";
import { getDoc,doc } from "firebase/firestore";
import { getfstore } from "../../fbase/fbaseimport";
import { Button } from "react-bootstrap";
import { AddWorkspaceMember } from "../../controller/WorkspaceController";

export const AccOrReject=()=>{

    
    
}

export const AccOrRejectB = () =>{
    const userContext = UseCurrUser()
    const user = userContext.user
    const navigateTo = useNavigate()
    const {id} = useParams();
    const [inviteData, setInviteData] = useState([]);
    const [loadData, setLoadData] = useState(true);
    
    useEffect(() => {

        getDoc( doc(getfstore, "Invitelink", id) )
        .then( (doc) => {
            setInviteData(doc.data());
            setLoadData(false)
        })

    }, [!loadData])

    if(!loadData){
        let linkCreated = inviteData.dateCreated.seconds;
        let currTime = new Date().getTime()/1000
        let valid = ""
        // console.log(user)
        if(userContext.currUser === null){
            navigateTo('/'+id);
        } else if(user.data.JoinedBoard.includes(inviteData.boardId)){
            valid = "joined";
        } else if((currTime - linkCreated) > 14400){
            valid = "expired";
        }

        if(valid===''){
            return <div>
                <Button onClick={()=>{
                    console.log(inviteData)
                    AddWorkspaceMember(user.id,inviteData.boardID)
                    navigateTo('/boarddetails/'+inviteData.boardID)
                }}>Accept</Button>
                <Button onClick={()=>{
                    navigateTo('/home')
                }}>Reject</Button>
            </div>
        }

    }
}