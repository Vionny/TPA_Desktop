import { Button } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import {signInWithEmailAndPassword}  from "@firebase/auth"
import { getAuth, onAuthStateChanged } from '@firebase/auth';
import app from "../../fbase/fbaseimport";

export const LoginPage = ()=>{

    let emailInput2
    let passInput2

    const emailInput = (e)=>{
        // console.log(e.target.value);
        emailInput2 = e.target.value
    }

    const passInput = (e)=>{
        // console.log(e.target.value);
        passInput2 = e.target.value
    }
    const auth = getAuth(app)
    const goToHome = useNavigate()
    const loginVal = ()=>{
        if(emailInput2!==''&&passInput2!==''){
            signInWithEmailAndPassword(auth,emailInput2,passInput2)
        }
        goToHome('/home')
    }

    return <div>
        <div><h1>Login</h1></div>
        <div>
            <p>Email :</p>
            <input onChange={emailInput} type="text" placeholder="Enter your email"></input>
            <p>Password</p>
            <input onChange={passInput} type="password" placeholder="Enter your password"></input>
        </div>
        <Button variant="primary" onClick={()=>{loginVal()}}>Login</Button>
        <Link to="/register">Register</Link>
    </div>
}