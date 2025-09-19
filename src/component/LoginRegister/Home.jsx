import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Button } from "react-bootstrap";

import { ViewAllBoards, ViewClosedBoards, ViewFavoriteBoards} from '../Views/Board';
import { ViewAllWorkspace, ViewJoinedWorkspace } from '../Views/Workspace';
import { updateDoc } from 'firebase/firestore';
import { getfstore } from '../../fbase/fbaseimport';
import { UseCurrUser } from './Auth';
import { UpdateUserFreq } from '../../controller/UserController';

export const HomePage = ()=>{

    const [view,setView]=useState('')
    const userContext = UseCurrUser()
    const userid = userContext.user.id
    const username= userContext.user.data.Username
    return <div>
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand href="/home">CHello :3 - {username}</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <Nav.Link onClick={()=>{setView('ViewAllWorkspace')}}>All Workspaces</Nav.Link>
                    <Nav.Link onClick={()=>{setView('ViewJoinedWorkspace')}}>Joined Workspaces</Nav.Link>
                    <Nav.Link onClick={()=>{setView('ViewAllBoards')}}>All Boards</Nav.Link>
                    <Nav.Link onClick={()=>{setView('ViewFavoriteBoards')}}>Favorite Boards</Nav.Link>
                    <Nav.Link onClick={()=>{setView('ViewClosedBoards')}}>Closed Boards</Nav.Link>
                    <Nav.Link onClick={()=>{setView('settings')}}>Settings</Nav.Link>
                </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
        {view==='ViewAllWorkspace'&&<ViewAllWorkspace/>}
        {view==='ViewJoinedWorkspace'&&<ViewJoinedWorkspace/>}
        {view==='ViewAllBoards'&&<ViewAllBoards/>}
        {view==='ViewFavoriteBoards'&&<ViewFavoriteBoards/>}
        {view==='ViewClosedBoards'&&<ViewClosedBoards/>}
        {view==='settings'&&<div>
            <div>
                <p>Notification Frequency</p>
                <Button onClick={()=>{UpdateUserFreq('never',userid)}}>Never</Button>
                <Button onClick={()=>{UpdateUserFreq('instantly',userid)}}>Instantly</Button>
                <Button onClick={()=>{UpdateUserFreq('periodically',userid)}}>Periodically</Button>
            </div>
            
            </div>}
    </div>

}