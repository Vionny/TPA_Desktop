import { addDoc, arrayUnion, collection, doc, getDoc, getDocs, onSnapshot, query, updateDoc, where } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import { getfstore } from '../../fbase/fbaseimport'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import {Navbar,Table,Button,Modal,ListGroupItem,ListGroup} from 'react-bootstrap';
import { UserInviteNotification, UserNotificationUpdate, usersAddress } from '../../controller/UserController';
import { UseCurrUser } from '../LoginRegister/Auth';
import { boardAddress, CreateNewBoard } from '../../controller/BoardController';
import { GetAllWorkspaceBoardsID, GrantAdmin, LeaveWorkspace, RevokeAdmin, setWorkspaceVisibility } from '../../controller/WorkspaceController';
import { Link} from "react-router-dom"

// function GetUserName (userid){
//     const [user,setUser] = useState(0)
//     getDoc(doc(getfstore,'Users',userid)).then((doc)=>{
//         const user1 = doc.data()
//         setUser(user1)
//     })
//     console.log(user)
//     return user
// }

export const WorkspaceDetailsPage=()=>{
    
    //member,admin -> mannage role, remove member
    //invite 
    //leave workspace
    //delete workspace
    
    const {workspaceid}= useParams()
    const [workspace,setWorkspace] = useState({})
    const [loadWs, setLoadWs] = useState(true);
    const [users,setUsers]= useState({})
    const [loadUs, setLoadUs] = useState(true);
    const [userids,setUserIds] = useState({})
    const userContext = UseCurrUser()
    const userName = userContext.user.displayName
    const curruserid = userContext.user.id  
    const [workspaceadmins,setWorkspaceAdmins] = useState({})
    const [workspacemembers,setWorkspaceMembers]=useState({})
    
    useEffect(()=>{
        getDoc(doc(getfstore,'Workspaces',workspaceid)).then((doc)=>{
            const workspace1 = doc.data()
            setWorkspace(workspace1)
            setWorkspaceAdmins(workspace1.WorkspaceAdminID)
            setWorkspaceMembers(workspace1.WorkspaceMemberID)
            setLoadWs(false)
        })
    },[!loadWs])

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
    const [workspaceBoardsID,setWorkspaceBoardsID] = useState({})
    const [view,setView]=useState('')
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const invitationRef = collection(getfstore, "Invitelink");
    const [link, setLink] = useState("");
    const [show2,setShow2] = useState(false)
    const GenInviteLink = (workspaceId) => {
    

        try{
            addDoc(invitationRef, {
                workspaceID: workspaceId,
                dateCreated: new Date()
            }).then((doc) => {
                setLink("http://localhost:3000/invitationlink/" + doc.id)
            })
    
        }catch (error){
           console.log(error)
        }
      }
      const [allBoardID,setAllBoardsID]= useState({})

      const[loadWBD,setLoadWBD] = useState(true)
    function GetAllWorkspaceBoardsID(workspaceid){
        onSnapshot(query(collection(getfstore, 'Boards'), where('WorkspaceID', '==', workspaceid)), (snapshot)=>{
            let newBoard = []
            let newBoardID = [];
             snapshot.docs.forEach((doc)=>{
            // // console.log(doc.data())
            // if (doc.data().visible === 'Private' && !doc.data().members.includes(curr["currUser"].uid)) {
                
            //     return;
            // }

            // if (doc.data().visible === 'Workspace' && !wss.includes(curr["currUser"].uid)) {
            //     console.log("Tesssss")
            //     return;
            // }

            // if (doc.data().status !== 'active') {
            //     console.log('inactive board')
            //     return;
            // }
            
            newBoard.push({
                ...doc.data(), id:doc.id
            })
            newBoardID.push({
                id:doc.id
            })
            }) 
            setWorkspaceBoardsID(newBoardID)
            setLoadWBD(false)
        })
    }
      const [show3, setShow3] = useState(false);
      let nameInput
  
      const handleClose2 = () => setShow3(false);
      const handleShow2 = () => setShow3(true);
      const handleCreate = ()=>{
          if(nameInput!==''){
              CreateNewBoard(nameInput,workspaceid,curruserid)
              setLoadWs(true)
              setShow3(false);
          }
      }
      const goHome = useNavigate()
                      
      const [boards, setBoards] = useState([]);
      const [loadBD, setLoadBD] = useState(true);
      useEffect(() => {
          
          let q = query(boardAddress,);
            let board= [];
  
          onSnapshot(q, (snapShot)=>{
            snapShot.docs.forEach( (doc) => {
               board.push(
                  {
                     ...doc.data(),
                     id: doc.id
                  });
  
              })
              setBoards(board)
              setLoadBD(false)
               
            })
          
      },[!loadBD])



    if(!loadWs&&!loadUs&&!loadBD){
        let valid = ""
        if(workspace.WorkspaceAdminID.includes(curruserid)){
            
            valid="admin"
        } 
        return <div>
            <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand href="/home">CHello :3 - [{workspace.WorkspaceName}]</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <Nav.Link onClick={()=>{setView('ViewAllMembers')}}>View All Members</Nav.Link>
                    <Nav.Link onClick={()=>{setView('ViewWorkspaceBoard')}}>Workspace's Board</Nav.Link>
                    
                </Nav>
                </Navbar.Collapse>
                
            </Container>
        </Navbar>
        {view==='ViewAllMembers'&&<div>
            <div>
            <Button onClick={()=>{
                        let count = 0
                        count = count + workspacemembers.length + workspaceadmins.length
                        LeaveWorkspace(curruserid,workspaceid,count)
                        goHome('/home')
            }}>Leave Workspace</Button>
            <Button onClick={()=>{
                GetAllWorkspaceBoardsID(workspaceid)
                if(!loadWBD){
                    workspaceBoardsID.map((id)=>{
                        console.log(id.id)
                        updateDoc(doc(getfstore, "Boards",id.id),{
                            BoardStatus : 'closed',
                            WorkspaceID : ''
                        })
                    })
                    LeaveWorkspace(curruserid,workspaceid,1)
                    goHome('/home')
                }
                }}>Delete Workspace</Button>
                <div>
                    <p>Workspace Visibility</p>
                    <Button onClick={()=>{setWorkspaceVisibility(workspaceid,'private')}}>Private</Button>
                    <Button onClick={()=>{setWorkspaceVisibility(workspaceid,'public')}}>Public</Button>
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
                        GenInviteLink(workspaceid)
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
                                
                                if(curruserid!==user.UserID&& !user.JoinedWorkspaces.includes(workspaceid)){
                                   return <ListGroup.Item ><div>
                                    <h4>{user.Username}</h4>
                                    
                                    <Button onClick={()=>{
                                        //  console.log(user.OwnedBoard.userid)
                                        GenInviteLink(workspaceid)
                                        console.log(link)
                                        UserInviteNotification(user.userid,"Invitation Notice : "+userName+" has invited you to join "+workspace.WorkspaceName+" through this link : "+link)
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
            {workspace.WorkspaceAdminID.map((adminid)=>{
                if(userids.includes(adminid)){
                    let index = userids.indexOf(adminid);
                    let user = users[index]
                    return <tr>
                    <td>{user.Username}</td>
                    <td>Admin</td>
                    {valid==="admin"&&<div>
                        <td><Button onClick={()=>{
                                if(!loadWs){
                                    setWorkspaceAdmins(workspaceadmins.splice(workspaceadmins.indexOf(adminid),1))
                                    updateDoc(doc(getfstore, "Workspaces", workspaceid), {
                                        WorkspaceMemberID: arrayUnion(adminid),
                                        WorkspaceAdminID: workspaceadmins
                                    }).then(setLoadWs(true))
                                }
                        }}>Remove Role</Button></td>
                    <td><Button onClick={()=>{
                        if(!loadWs){
                            setUsers()
                            setWorkspaceAdmins(workspaceadmins.splice(workspaceadmins.indexOf(adminid),1))
                            updateDoc(doc(getfstore, "Workspaces", workspaceid), {
                                WorkspaceAdminID: workspaceadmins
                            }).then(setLoadWs(true))
                        }
                    }}>Remove Member</Button></td>
                    </div>}
                    
                    </tr>
                }
            })}
            {workspace.WorkspaceMemberID.map((memberid)=>{
                if(userids.includes(memberid)){
                    let index = userids.indexOf(memberid);
                    let user = users[index]
                    return <tr>
                    <td>{user.Username}</td>
                    <td>Members</td>
                    {/* {console.log(workspace.WorkpsaceAdminID,curruserid)} */}
                    {valid==="admin"&&<div>
                        <td><Button onClick={()=>{
                            if(!loadWs){
                                setWorkspaceMembers(workspacemembers.splice(workspacemembers.indexOf(memberid),1))
                                updateDoc(doc(getfstore, "Workspaces", workspaceid), {
                                    WorkspaceAdminID: arrayUnion(memberid),
                                    WorkspaceMemberID: workspacemembers
                                }).then(setLoadWs(true))
                                
                            }
                        }}>Grant Role</Button></td>
                    <td><Button onClick={()=>{
                        if(!loadWs){
                            setUsers()
                            setWorkspaceMembers(workspaceadmins.splice(workspaceadmins.indexOf(memberid),1))
                            updateDoc(doc(getfstore, "Workspaces", workspaceid), {
                                WorkspaceMembersID: workspacemembers
                            }).then(setLoadWs(true))
                        }
                    }}>Remove Member</Button></td>
                    </div>}
                    
                    </tr>
                }
            })}
                 </tbody>
            </Table>
        </div>}
        {view==='ViewWorkspaceBoard'&&<div>
            <div>
                <Button variant="primary" onClick={handleShow2}>Create Board +</Button>
            </div>
            <Modal show={show3} onHide={handleClose2}>
                <Modal.Header closeButton>
                <Modal.Title>Create New Board</Modal.Title>
                </Modal.Header>
                <Modal.Body><div>
                    <p>Board Name</p>
                    <input onChange={(e)=>{nameInput= e.target.value}} type="text" placeholder="Board Name"></input>
                    </div></Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose2}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleCreate}>
                    Create
                </Button>
                </Modal.Footer>
            </Modal>
            <div>
            
                <ListGroup>
                    {boards.map((board)=>{
                        if(board.WorkspaceID === workspaceid) return <Link to={'/boarddetails/'+board.id}><ListGroup.Item key={board.id}><div>
                            <h4>{board.BoardName}</h4>
                            <p>{board.BoardStatus}</p>
                            </div></ListGroup.Item></Link>
                    })}
                    
                </ListGroup>
                </div>
          
        </div>}
        </div>
    }
    
}