import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Homepage, NotebookRepository } from './App';
import { CanvasEditor } from './canvas/Canvas';

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