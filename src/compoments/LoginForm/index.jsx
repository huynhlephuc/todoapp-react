import React, { useEffect, useState } from 'react';
import './login.css'; 
import { db} from '../../firebase-cogfix'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider , signInWithPopup, FacebookAuthProvider } from "firebase/auth";

import { v4 as uuidv4 } from 'uuid';


import {
    Route,
    Link,
  } from "react-router-dom";
import { doc, setDoc } from 'firebase/firestore';




function LoginForm(props) {
    
    const {title} = props;
    const [email , setEmail] = useState("");
    const [password, setPassword] = useState("");

    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    
    // sign in
    function handleSubmit() {
        signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
          })
          .catch((error) => {
          console.log(error)
          
          });
        
    }

    // sign up
    function handleSignup() {
        if (email && password) {
            console.log(email, password); 
            const auth = getAuth();
            createUserWithEmailAndPassword(auth, email, password)
            .then(async(userCredential) => {
                // Signed in 
                const user = userCredential.user;
                console.log(user);

                await setDoc(doc(db, "users", user.uid),{
                    id: uuidv4(),
                    displayName: user.displayName? user.displayName: "no name",
                    tasklist:[]

                });
            })
            .catch((error) => {
                console.log(error)
                const errorCode = error.code;
                const errorMessage = error.message;
                // ..
            });

        }
        else {
            alert("Please enter your email and password");
        }
    }

    //signin wwith google account
    function handleSubmitGoogle() {
        signInWithPopup(auth, provider)
        .then(async(result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
            await setDoc(doc(db, "users", user.uid),{
                id: uuidv4(),
                photoURL: user.photoURL,
                displayName: user.displayName? user.displayName: "no name",
                tasklist:[]

            });
            // ...
        }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
  });
    }

    //login with fb
    function handleSubmitFB(){
        const providerFB = new FacebookAuthProvider();
        signInWithPopup(auth, providerFB)
  .then(async(result) => {
    // The signed-in user info.
    const user = result.user;

    await setDoc(doc(db, "users", user.uid),{
        id: uuidv4(),
        photoURL: user.photoURL,
        displayName: user.displayName? user.displayName: "no name",
        tasklist:[]

    });

    // This gives you a Facebook Access Token. You can use it to access the Facebook API.
    const credential = FacebookAuthProvider.credentialFromResult(result);

    // ...
  })
  .catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.email;
    // The AuthCredential type that was used.
    const credential = FacebookAuthProvider.credentialFromError(error);

    // ...
  });
    }

    return (
        <div className="container-form">
            <div className="space">

            </div>
           <div className="login-box">
                <h3 style={{fontSize: '30px'}}>{title}</h3>
                <div>
                    <input onChange={(e)=> {setEmail(e.target.value)}} type="text" className="userName" placeholder="Email ..." value={email}/>
                </div>
                <div>
                    <input onChange={(e)=> {setPassword(e.target.value)}} type="password" className="password" placeholder="Password..." value={password}/>
                </div>
                <div>
                    <button onClick= {title ==='LOGIN' ? handleSubmit : handleSignup} type="submit" className="btn_login_nor" >{title}</button>
                </div>
                <div>
                    <button type="submit" className="btn_login" onClick={handleSubmitGoogle} >login with google</button>
                </div>
                <div>
                    <button type="submit" className="btn_login" onClick={handleSubmitFB} >login with facebook</button>
                </div>
                
                <div>
                    <Route>
                       {

                        title === "LOGIN" ?  <Link to="/signup">Dang ki</Link> : <Link to="/login">Dang nhap</Link>
                        }
                        
                    </Route>
                    
                    
                </div>

           </div>
        </div>
    );
}

export default LoginForm;