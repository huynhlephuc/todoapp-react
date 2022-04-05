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

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme();


function LoginForm(props) {
    
    const {title} = props;
    const [email , setEmail] = useState("");
    const [password, setPassword] = useState("");

    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    const handleSubmit = (event) => {
        event.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in 
          const user = userCredential.user;
        })
        .catch((error) => {
        console.log(error)
        
        });
      };
   

    // sign up
    function handleSignup(event) {
        event.preventDefault();
        if (email&& password) {
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

   
    return (
   
        <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              {title}
            </Typography>
            <Box component="form"  onSubmit={title==='LOGIN' ? handleSubmit: handleSignup} noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                onChange={(e)=>setEmail(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                onChange={(e)=>setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                onClick={title==='LOGIN' ? handleSubmit: handleSignup}
              >
                {title}
              </Button>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 2 }}
                onClick={handleSubmitGoogle}
              >
                SignIn with Goole
              </Button>
              <Grid container>
               
                <Grid item>
                <Route>
                       {

                        title === "LOGIN" ?  <Link to="/signup">Dang ki</Link> : <Link to="/login">{title}</Link>
                        }
                        
                    </Route>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    );
}

export default LoginForm;