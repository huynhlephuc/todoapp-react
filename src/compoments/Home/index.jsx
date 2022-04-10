import React, { useContext , useState, useEffect, useRef} from 'react';
import {AuthContext} from '../../context/AuthProvider'
import { getAuth, signOut } from "firebase/auth";
import { doc, updateDoc , arrayUnion, onSnapshot, arrayRemove,setDoc} from "firebase/firestore";
import {db} from "../../firebase-cogfix";
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import { v4 as uuidv4 } from 'uuid';
import "./style.css";
import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
  import Avatar from '@mui/material/Avatar';
  import { deepOrange, deepPurple } from '@mui/material/colors';
import { CloseFullscreen } from '@mui/icons-material';


function Home() {

    // context users
    const authUser = useContext(AuthContext)
    /* console.log("🚀 ~ file: index.jsx ~ line 21 ~ Home ~ authUser", authUser) */
    const [data , setData] = useState([]);
    const [taskName, setTaskName] = useState("");
    const [filter, setFilter] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [updateShow, setUpdateShow] = useState("btn_update_none");
    const [addShow, setAddShow] = useState("btn_add_style");
    const [task, setTaskt] = useState("");
   /*  const [noteShow, setNoteShow] = useState("DELETE"); */

    const inputRef = useRef();
    
    
    const handleLogout = () => {

    const auth = getAuth();
    signOut(auth).then(() => {
    // Sign-out successful.
    }).catch(err => console.log(err))
    };

    const userID = authUser.user.uid;
    const userRef = doc(db, 'users', userID);
    
    
    useEffect(() =>{
        //real time database - onSnapshot
        const unsub = onSnapshot(userRef, (doc) => {
            
            const data = doc.data();
            setDisplayName(data.displayName)
            if (data.tasklist){
                setData(data.tasklist);
            }else {
                setData([]);
            }

           if(filter === 'completed'){
               let dataNew = data.tasklist.filter(task=> {
                   return task.iscompleted === true
               })
               setData(dataNew)
           }else if(filter === 'uncompleted'){
                let dataNew = data.tasklist.filter(task=> {
                    return task.iscompleted === false
                })
            setData(dataNew)
           }else {
            setData(data.tasklist);
           }


        });
        return () => {
            unsub() 
        }
    },[filter])

    async function handleChangeTask (id) {
        const tasks = data.map(task => {
            if(task.id === id) {
                return {...task, iscompleted: !task.iscompleted }
            }
            return task;
        })
        await updateDoc(userRef, {
            tasklist: tasks
          }).then(()=> {
            toast.success("Update task successfully")
          })
    }

    async function upDateTodo(task) {
        await updateDoc(userRef, {
            tasklist:arrayUnion({
                "id": task.id,
                "name": taskName,
                "iscompleted": task.iscompleted,
            }),
          })
    }
    
    async function handleDeleteTask(id) {
        const taskById = data.find(task => task.id === id)
        await updateDoc(userRef, {
            tasklist: arrayRemove(taskById)
          }).then(() => {
             if (id == "undentifled" ) {
                toast.success("Update task successfully", {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                })
             }else {
                toast.success("Delete task successfully", {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                })
             }


          })
    }

    //add work list
    async function handleAddTodo () {
       
        await updateDoc(userRef, {
            tasklist:arrayUnion({
                id: uuidv4(),
                name: taskName,
                iscompleted: false,
            }),
          }).then(()=>{
            toast.success("Add task successfully", {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
          });
          setTaskName("");
          inputRef.current.focus();
          
    }

    async function handleEditTask(task) {
    console.log("🚀 ~ file: index.jsx ~ line 161 ~ handleEditTask ~ task", task)
      
        setTaskName(task.name);
        setUpdateShow("");
        setAddShow("btn_add_hide");
        
     
    }


    async function upDateTodo(id)  {
    const tasks = data.map(task => {
        if(task.id === id) {
            return {...task, name:  taskName}
        }
        return task;
    })
    await updateDoc(userRef, {
        tasklist: tasks
      }).then(()=> {
        toast.success("Update task successfully")
      })

       /*  await updateDoc(userRef, {
            tasklist:arrayUnion({
                "id": task.id,
                "name": taskName,
                "iscompleted": task.iscompleted,
            }),
          })

        setTaskName("");
        setUpdateShow("btn_update_none");
        setAddShow(""); */
    }

    
    

    
    return (
       <>
       
        <div className="container">
            <div className="info">
                {authUser.user.photoURL ?
                 <Avatar alt={displayName} src={authUser.user.photoURL} />
                 :
                 <Avatar sx={{ bgcolor: deepOrange[500] }}>{displayName.charAt(0)}</Avatar>}
                
                <p>{authUser.user.displayName ||  authUser.user.email}</p> 
                <button onClick={handleLogout}>Logout</button>
            </div>
            <div className="addtask">
                <div  className="txt_todo">
                <input ref={inputRef} type="text" value={taskName} onChange={(e) =>{setTaskName(e.target.value)}}/>
                </div>
                <div className="btn">

                    
                    <button className={addShow} onClick={handleAddTodo}>Add</button>
                    <button className={updateShow} onClick={(e) => {upDateTodo(task.id)}}>Update</button>

                </div>
            </div>
            <div className="filter">
                <button className={filter==='all' ? 'active' : 'abc'} onClick={()=>{setFilter('all')}}>ALL</button>
                <button className={filter==='completed' ? 'active': 'abc'} onClick={()=>{setFilter('completed')}}>COMPLETED</button>
                <button className={filter==='uncompleted' ? 'active': 'abc'} onClick={()=>{setFilter('uncompleted')}}>UNCOMPLETED</button>
            </div>
            <div className="listtask">
                <ul>
                    {
                        data.map((task)=> {
                            return (
                                <li key={task.id} className={task.iscompleted === true ? "complete" : "uncomplete"}>
                                <p className="tasktext" onClick={()=>{handleEditTask(task) && setTaskt(task)}}>{task.name}</p>
                                
                                <div className="taskdelete">
                                <DeleteIcon onClick={()=> {handleDeleteTask(task.id)}}/>
                                </div>
                                {
                                filter ==='all' ?  
                                <div className="taskiscompleted" >
                                {task.iscompleted?  <CheckIcon onClick={()=> {handleChangeTask(task.id)}}/> :<CloseIcon onClick={()=> {handleChangeTask(task.id)}} />}
                                </div> 
                                :
                                <div className="taskiscompleted" >
                                {task.iscompleted?  <CheckIcon /> :<CloseIcon  />}
                                </div>
                                }
                               
                      </li>
                            )
                        })
                    }
                     
                     
                </ul>
            </div>
            <ToastContainer />
        </div>
       </>
        
    )
    }
export default Home;