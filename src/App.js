import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './App.css';
import Home from './components/pages/HomePage/Home';
import Footer from './components/pages/Footer/Footer'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Navbar from './components/Navbar';

const EnableScroll = () => {
	const safeDocument = typeof document !== 'undefined' ? document : {};
	const { body } = safeDocument;
    if (!body || !body.style) return;
    body.style.overflow = 'auto'; 
}

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
