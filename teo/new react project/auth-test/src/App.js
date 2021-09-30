import React, { useEffect } from 'react';
import Signup from "./Signup"
import { AuthProvider } from "./AuthContext"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import Dashboard from "./Dashboard"
import Login from "./Login"
import PrivateRoute from "./PrivateRoute"
import ForgotPassword from "./ForgotPassword"
import UpdateProfile from "./UpdateProfile"
import { CanvasEditor } from './canvas/Canvas';
import { NotebookRepository } from './notebook_gallery/NotebookRepository'
import './App.css';

import Home from './components/pages/HomePage/Home';
import Footer from './components/pages/Footer/Footer'
import Navbar from './components/Navbar';


const EnableScroll = () => {
	const safeDocument = typeof document !== 'undefined' ? document : {};
	const { body } = safeDocument;
    if (!body || !body.style) return;
    body.style.overflow = 'auto'; 
}

document.title = "Writeboard";

export const Homepage = () => {
	useEffect(() => {
		EnableScroll();
	});

	return (
		
		<div>
			<Navbar />
			<Home/>
			<Footer />
		</div>
		
		
	)
};

function App() {
  return (
        <Router>
          <AuthProvider>
            <Switch>
              <Route exact path="/" component={Homepage} />
              <Route path="/update-profile" component={UpdateProfile} />
              <Route path="/signup" component={Signup} />
              <Route path="/login" component={Login} />
              <Route path="/forgot-password" component={ForgotPassword} />
              <Route path="/canvas" component={CanvasEditor} />
              <Route path="/repo" component={NotebookRepository} />
            </Switch>
          </AuthProvider>
        </Router>
  )
}

export default App
