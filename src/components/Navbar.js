import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import './Navbar.css'
import { List } from 'react-bootstrap-icons';
import { Sidebar } from './Sidebar'
import { GallerySection } from './GallerySection';


const Navbar = () => {
    const [click, setClick] = useState(false);
    const [button, setButton] = useState(true);

    const handleClick = () => setClick(!click);
    const closeMobileMenu = () => setClick(false);

    const showButton = () => {
        if(window.innerWidth <= 960)
        {
            setButton(false);
        }
        else
        {
            setButton(true);
        }
    };

    // useEffect(() => {
    //     showButton();
    // }, []);

    window.addEventListener('resize', showButton);

    const [isSidebar, setIsSidebar] = useState(true);
    const showSidebar = () => {
        setIsSidebar(!isSidebar);
    }
    
    return (
        <React.Fragment>
            <nav className='navbar'>
            <div className="navbar-container">
                   <List className="bi bi-list list-icon" onClick={() => setIsSidebar(!isSidebar)}/>
                   <Link to="/" className="navbar-logo noSelect">
                      Whiteboard    
                   </Link>    
                   <ul className='nav-menu'>
                       <li className='nav-item noSelect'>
                           <Link to='/' className='nav-links'>
                               HOME
                           </Link>
                       </li>
                       <li className='nav-item noSelect'>
                           <Link to='/' className='nav-links'>
                                LOG OUT
                           </Link>
                       </li>
                   </ul>
                </div>     
            </nav>
            <Sidebar 
                sidebarState={[isSidebar, setIsSidebar]} />
        </ React.Fragment>
    )}

export default Navbar

