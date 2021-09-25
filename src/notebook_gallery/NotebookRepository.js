import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { GallerySection } from './components/GallerySection';

const DisableScroll = () => {
	const safeDocument = typeof document !== 'undefined' ? document : {};
	const { body } = safeDocument;
    if (!body || !body.style) return;
    body.style.overflow = 'hidden'; 
}

export const NotebookRepository = () => {
    useEffect(() => {
        DisableScroll();
    });

	return (
        <React.Fragment>
            <Navbar />
        </React.Fragment>
	)
};