import React, { useEffect } from 'react';
import './App.css';
import Home from './components/pages/HomePage/Home';
import Footer from './components/pages/Footer/Footer'
import Navbar from './components/Navbar';

document.title = "Writeboard";

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
