import { Button,ListGroup,Modal } from "react-bootstrap";
import { useEffect, useState } from "react";
import { CreateNewWorkspace,  workspaceAddress } from "../../controller/WorkspaceController";
import { onSnapshot, orderBy, query } from "firebase/firestore";
import { UseCurrUser } from "../LoginRegister/Auth";
import { Link} from "react-router-dom"

export const ViewAllWorkspace=()=>{

    const [workspaces, setWorkspaces] = useState([]);
    const [loadWs, setLoadWs] = useState(true);
    const userContext = UseCurrUser()
    const userid = userContext.user.id  
    useEffect(() => {
        
        let q = query(workspaceAddress, orderBy('WorkspaceName', 'asc'));
       const workspace = [];

        onSnapshot(q, (snapShot)=>{
          snapShot.docs.forEach( (doc) => {
             workspace.push(
                {
                   ...doc.data(),
                   id: doc.id
                });

            })
            setWorkspaces(workspace)
            setLoadWs(false)
             
          })
        
    },[!loadWs])
    
    const [show, setShow] = useState(false);
    let nameInput
    let descInput

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleCreate = ()=>{
        if(nameInput!==''&&descInput!==''){
            CreateNewWorkspace(userid,nameInput,descInput)
            setLoadWs(true)
            setShow(false);
        }
    }
  
    if(!loadWs) return <div>
        {console.log(workspaces)}
        
        <div>
            <Button variant="primary" onClick={handleShow}>Create Workspace +</Button>
        </div>
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
            <Modal.Title>Create New Workspace</Modal.Title>
            </Modal.Header>
            <Modal.Body><div>
                <p>Workspace Name</p>
                <input onChange={(e)=>{nameInput= e.target.value}} type="text" placeholder="Workspace Name"></input>
                <p>Workspace Description</p>
                <input onChange={(e)=>{descInput = e.target.value}} type="text" placeholder="Workspace Description"></input>
                </div></Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Close
            </Button>
            <Button variant="primary" onClick={handleCreate}>
                Create
            </Button>
            </Modal.Footer>
        </Modal>

        <div>
            
        <ListGroup>
            {workspaces.map((workspace)=>{
                return <ListGroup.Item key={workspace.id}><div>
                    <h4>{workspace.WorkspaceName}</h4>
                    <p>{workspace.WorkspaceDescription}</p>
                    <p>{workspace.WorkspaceVisibility}</p>
                    </div></ListGroup.Item>
            })}
            
        </ListGroup>
        </div>
    </div>
}

export const ViewJoinedWorkspace= ()=>{
    const [workspaces, setWorkspaces] = useState([]);
    const [loadWs, setLoadWs] = useState(true);
    const userContext = UseCurrUser()
    const userid = userContext.user.id  
    const joinedWorkspace = userContext.user.data.JoinedWorkspaces
    useEffect(() => {
        
        let q = query(workspaceAddress, orderBy('WorkspaceName', 'asc'));
       const workspace = [];

        onSnapshot(q, (snapShot)=>{
          snapShot.docs.forEach( (doc) => {
             workspace.push(
                {
                   ...doc.data(),
                   id: doc.id
                });

            })
            setWorkspaces(workspace)
            setLoadWs(false)
             
          })
        
    },[!loadWs])

    if(!loadWs) return <div>
        {console.log(workspaces)}
        

        <div>
            
        <ListGroup>
            {workspaces.map((workspace)=>{
                if(joinedWorkspace.includes(workspace.id)){
                    return <Link to={'/workspacedetails/'+workspace.id}><ListGroup.Item key={workspace.id}><div>
                    <h4>{workspace.WorkspaceName}</h4>
                    <p>{workspace.WorkspaceDescription}</p>
                    <p>Status : {workspace.WorkspaceVisibility}</p>
                    </div></ListGroup.Item></Link>
                }
                
            })}
            
        </ListGroup>
        </div>
    </div>
}

