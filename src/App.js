import './App.css';
import LoginForm from './compoments/LoginForm';
import Home from './compoments/Home';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import AuthProvider from "./context/AuthProvider";



function App() {
  return (
    <div className="App">
     <Router>
       <AuthProvider>
        <Switch>
          <Route path="/login">
            <LoginForm title="LOGIN"/>
          </Route>

          <Route path="/signup">
            <LoginForm title="SIGN UP"/>
          </Route>
          
          <Route path="/">
            <Home />
          </Route>
        </Switch>
        </AuthProvider>
    </Router>
      
    </div>
  );
}

export default App;
