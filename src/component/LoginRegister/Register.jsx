import { Button } from "react-bootstrap"
import {getAuth,createUserWithEmailAndPassword} from "@firebase/auth"
import  app from "../../fbase/fbaseimport"
import { createNewUser } from "../../controller/UserController"
import { Link, useNavigate } from "react-router-dom"

export const RegisterPage = ()=>{

    let emailInput2
    let passInput2
    let username

    const emailInput = (e)=>{
        // console.log(e.target.value);
        emailInput2 = e.target.value
    }

    const passInput = (e)=>{
        // console.log(e.target.value);
        passInput2 = e.target.value
    }
    const usernameInput = (e)=>{
        username = e.target.value
    }
    const auth = getAuth(app)
    const goToLogin = useNavigate()
    const regis = ()=>{
        if(emailInput2!==''&&passInput2!==''&&username!==''){
            createUserWithEmailAndPassword(auth,emailInput2,passInput2).then(
                (UserCredential)=>{
                    createNewUser(UserCredential.user.uid,username,emailInput2,passInput2)
                }
            )
            goToLogin('/')
        }
    }

    return <div>
        <div><h1>Register</h1></div>
        <div>
            <p>Username :</p>
            <input onChange={usernameInput} type="text" placeholder="Enter your username"></input>
            <p>Email :</p>
            <input onChange={emailInput} type="text" placeholder="Enter your email"></input>
            <p>Password</p>
            <input onChange={passInput} type="password" placeholder="Enter your password"></input>
        </div>
        <Button variant="primary" onClick={()=>{regis()}}>Register</Button>
        <Link to ="/">Login here !</Link>
    </div>
}