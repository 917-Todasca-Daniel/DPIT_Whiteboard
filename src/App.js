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

const CanvasEditor = () => {
	return (
		<div>
				<h1>Canvas</h1>
				<Link to='/'>Go to Homepage</Link>
		</div>
	)
};

export {Homepage, CanvasEditor };