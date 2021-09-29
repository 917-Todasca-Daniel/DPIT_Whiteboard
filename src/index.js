import React from 'react';
import './index.css';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Homepage } from './App';
import { CanvasEditor } from './canvas/Canvas';
import { NotebookRepository } from './notebook_gallery/NotebookRepository'

ReactDOM.render(
    <Router>
       <Switch>
		        <Route exact path="/" component = { Homepage }/>
			    <Route exact path="/repo" component = { NotebookRepository }/>
			    <Route exact path="/canvas" component = { CanvasEditor }/>
	    </Switch> 
    </Router>,
    document.getElementById('root')
);