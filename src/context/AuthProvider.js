import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import { createContext } from 'react';
import { getAuth } from 'firebase/auth';


export const AuthContext = createContext();

export default function AuthProvider({children}) {
            const [user, setUser] = useState({})
            const [isLoading, setIsLoading] = useState(true)

    let history = useHistory();
    const auth = getAuth();
    useEffect(()=> {

    const unsubscribe = auth.onAuthStateChanged((user) => {
        if(user){
            const {displayName, email, uid, photoURL} = user;
            setUser({displayName, email, uid, photoURL});
            setIsLoading(false)
            history.push('/')
            return;
        }
        setUser({})
        setIsLoading(false)
        history.push('/login')
    })


    //cleanup function
    return () => {
        unsubscribe();
    }
   },[history])

  return (
   <AuthContext.Provider value={{user}}>
       {isLoading ? 'Loading...' : children}
   </AuthContext.Provider>
  )
}
