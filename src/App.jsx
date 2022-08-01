
import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { RegisterPage } from './component/LoginRegister/Register';
import { AuthProvider } from './component/LoginRegister/Auth';
import { LoginPage } from './component/LoginRegister/Login';
import { HomePage } from './component/LoginRegister/Home';
import { WorkspaceDetailsPage } from './component/Views/WorkspaceDetails';
import { AccOrReject, AccOrRejectB } from './component/Views/AcceptOrReject';
import { BoardDetailsPage } from './component/Views/BoardDetails';
import { Shortcut } from './controller/ShortcutController';

function App() {
  return (
    <AuthProvider>
        <BrowserRouter>
        <Shortcut>
            <Routes>
                <Route path="/" element={<LoginPage/>}/>
                <Route path="/register" element = {<RegisterPage/>}/>
                <Route path="/home" element = {<HomePage/>}/>
                <Route path="/workspacedetails/:workspaceid" element={<WorkspaceDetailsPage/>} />
                <Route path="/invitationlink/:id" element={<AccOrReject/>}></Route>
                <Route path="invitationlinkboard/:id" element ={<AccOrRejectB/>}></Route>
                <Route path="/boarddetails/:boardid" element={<BoardDetailsPage/>} />
            </Routes>
          </Shortcut>
        </BrowserRouter>
        
      </AuthProvider>
  );
}

export default App;
