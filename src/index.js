import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Account } from './Account';
import { Homepage, CanvasEditor } from './App';
import { NotebookRepository } from './NotebookRepository'

ReactDOM.render(
    <Router>
       <Switch>
		      <Route exact path="/" component = { Homepage }/>
			    <Route exact path="/repo" component = { NotebookRepository }/>
			    <Route exact path="/canvas" component = { CanvasEditor }/>
                <Route exact path="/account" component = { Account }/>
	    </Switch> 
    </Router>,
    document.getElementById('root')
);