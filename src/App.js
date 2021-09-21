import React from 'react';
import { Link } from 'react-router-dom';

const Homepage = () => {
	return (
		<div>
			<h1>Homepage </h1>
			<Link to='/repo'>Go to Notebook Repository</Link>
		</div>
	)
};

const NotebookRepository = () => {
	return (
		<div>
			<h1>Repository</h1>
			<Link to='/canvas'>Go to Canvas Editor</Link>
		</div>
	)
};

export {Homepage, NotebookRepository };