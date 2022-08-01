import { addDoc, arrayUnion, collection, doc, getDoc, onSnapshot, query, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Button, Container, ListGroup, Modal, Nav, Navbar, Table } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { boardAddress, LeaveBoard, setBoardStatus, setBoardVisibility } from "../../controller/BoardController";
import { UserInviteNotification, usersAddress } from "../../controller/UserController";
import { getfstore } from "../../fbase/fbaseimport";
import { UseCurrUser } from "../LoginRegister/Auth"


export const BoardDetailsPage=()=>{

    const {boardid}= useParams()
    const [board,setBoard] = useState({})
    const [loadBd, setLoadBd] = useState(true);
    const userContext = UseCurrUser()
    const userName = userContext.user.displayName
    const curruserid = userContext.user.id  
    const [boardmembers,setBoardMembers] = useState({})
    const [boardadmins,setBoardAdmins] = useState({})
    const [users,setUsers]= useState({})
    const [loadUs, setLoadUs] = useState(true); 
    const [userids,setUserIds] = useState({})
    const [view,setView]=useState('')
    const goHome = useNavigate()

    useEffect(()=>{
        getDoc(doc(getfstore,'Boards',boardid)).then((doc)=>{
            
            const board1 = doc.data()
            setBoard(board1)
            // console.log(board1)
            setBoardAdmins(board1.BoardAdminID)
            setBoardMembers(board1.BoardMemberID)
            setLoadBd(false)
        })
    },[!loadBd])

    useEffect(()=>{
        let q = query(usersAddress);
        const user = [];
        const userid=[]
 
         onSnapshot(q, (snapShot)=>{
           snapShot.docs.forEach( (doc) => {
              user.push(
                 {
                    ...doc.data(),userid:doc.id
                 });
                userid.push(doc.id)
             })
             
             setUsers(user)
             setUserIds(userid)
             setLoadUs(false)
              
           })
    },[!loadUs])
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const invitationRef = collection(getfstore, "Invitelink");
    const [link, setLink] = useState("");
    const [show2,setShow2] = useState(false)
    const GenInviteLink = (boardid) => {
    

        try{
            addDoc(invitationRef, {
                boardID: boardid,
                dateCreated: new Date()
            }).then((doc) => {
                setLink("http://localhost:3000/invitationlinkboard/" + doc.id)
            })
    
        }catch (error){
           console.log(error)
        }
      }
    if(!loadUs&&!loadBd){
        let valid = ""
            if(board.BoardAdminID.includes(curruserid)){
                
                valid="admin"
            } 
    return <div>
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand href="/home">CHello :3 - [{board.BoardName}]</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <Nav.Link onClick={()=>{setView('ViewAllMembers')}}>View All Members</Nav.Link>
                    <Nav.Link onClick={()=>{setView('ViewWorkspaceBoard')}}>View All List</Nav.Link>
                    
                </Nav>
                </Navbar.Collapse>
                
            </Container>
        </Navbar>
        {view==='ViewAllMembers'&&<div>
            <div>
            <Button onClick={()=>{
                        let count = 0
                        count = count + boardmembers.length + boardadmins.length
                        LeaveBoard(curruserid,boardid,count)
                        goHome('/home')
            }}>Leave Board</Button>
            <Button onClick={()=>{
                    LeaveBoard(curruserid,board,1)
                    goHome('/home')
                
                }}>Delete Board</Button>
                <Button onClick = {()=>{
                    setBoardStatus(boardid,'closed')
                }}> Close Board</Button>
                <Button onClick = {()=>{
                    setBoardStatus(boardid,'open')
                }}> Open Board</Button>
                <div>
                    <p>Board Visibility</p>
                    <Button onClick={()=>{setBoardVisibility(boardid,'private')}}>Private</Button>
                    <Button onClick={()=>{setBoardVisibility(boardid,'public')}}>Public</Button>
                    <Button onClick={()=>{setBoardVisibility(boardid,'workspace')}}>Workspace Members only</Button>
                </div>
                <div>
                    <Button variant="primary" onClick={handleShow}>Invite Member</Button>
                </div>
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                    <Modal.Title>Invite New Member</Modal.Title>
                    </Modal.Header>
                    
                    <Modal.Body><div>
                       <Button onClick={()=>{
                        GenInviteLink(boardid)
                        setShow2('link')}}>Generate Link</Button>
                       <Button onClick={()=>{
                        
                        setShow2('email')
                       }}>Invite by Invitation Email</Button>
                       </div>
                       {show2==='link'&&<div>
                            {link}
                            
                        </div>}
                        {show2==='email'&&<div>
                        {/* {console.log(users)} */}
                        <ListGroup>
                           
                            {users.map((user)=>{
                                
                                if(curruserid!==user.UserID&& !user.JoinedBoard.includes(boardid)&&!user.OwnedBoard.includes(boardid)){
                                   return <ListGroup.Item ><div>
                                    <h4>{user.Username}</h4>
                                    
                                    <Button onClick={()=>{
                                        //  console.log(user.OwnedBoard.userid)
                                        GenInviteLink(boardid)
                                        console.log(link)
                                        UserInviteNotification(user.userid,"Invitation Notice : "+userName+" has invited you to join "+board.BoardName+" through this link : "+link)
                                    }}>Invite</Button>
                                    </div></ListGroup.Item>
                                }
                                
                            })}
                        </ListGroup>

                        </div>
                            }
                       </Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    </Modal.Footer>
                </Modal>
            </div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                    <th>Member's Username</th>
                    <th>Role</th>
                    <th></th>
                    <th></th>
                    </tr>
                </thead>
                <tbody>
            {board.BoardAdminID.map((adminid)=>{
                if(userids.includes(adminid)){
                    let index = userids.indexOf(adminid);
                    let user = users[index]
                    return <tr>
                    <td>{user.Username}</td>
                    <td>Admin</td>
                    {valid==="admin"&&<div>
                        <td><Button onClick={()=>{
                                if(!loadBd){
                                    setBoardAdmins(boardadmins.splice(boardadmins.indexOf(adminid),1))
                                    updateDoc(doc(getfstore, "Boards", boardid), {
                                        BoardMemberID: arrayUnion(adminid),
                                        BoardAdminID: boardadmins
                                    }).then(setLoadBd(true))
                                }
                        }}>Remove Role</Button></td>
                    <td><Button onClick={()=>{
                        if(!loadBd){
                            setUsers()
                            setBoardAdmins(boardadmins.splice(boardadmins.indexOf(adminid),1))
                            updateDoc(doc(getfstore, "Workspaces", boardid), {
                                BoardAdminID: boardadmins
                            }).then(setLoadBd(true))
                        }
                    }}>Remove Member</Button></td>
                    </div>}
                    
                    </tr>
                }
            })}
            {board.BoardMemberID.map((memberid)=>{
                if(userids.includes(memberid)){
                    let index = userids.indexOf(memberid);
                    let user = users[index]
                    return <tr>
                    <td>{user.Username}</td>
                    <td>Members</td>
                    {/* {console.log(workspace.WorkpsaceAdminID,curruserid)} */}
                    {valid==="admin"&&<div>
                        <td><Button onClick={()=>{
                            if(!loadBd){
                                setBoardMembers(boardmembers.splice(boardmembers.indexOf(memberid),1))
                                updateDoc(doc(getfstore, "Boards", boardid), {
                                    BoardAdminID: arrayUnion(memberid),
                                    BoardMemberID: boardmembers
                                }).then(setLoadBd(true))
                                
                            }
                        }}>Grant Role</Button></td>
                    <td><Button onClick={()=>{
                        if(!loadBd){
                            setUsers()
                            setBoardMembers(boardadmins.splice(boardadmins.indexOf(memberid),1))
                            updateDoc(doc(getfstore, "Boards", boardid), {
                                BoardMembersID: boardmembers
                            }).then(setLoadBd(true))
                        }
                    }}>Remove Member</Button></td>
                    </div>}
                    
                    </tr>
                }
            })}
                 </tbody>
            </Table>
        </div>}
    </div>
    }
}