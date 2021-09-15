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

    useEffect(() => {
        showButton();
    }, []);

    window.addEventListener('resize', showButton);

    const [isSidebar, setIsSidebar] = useState(true);
    const showSidebar = () => {
        setIsSidebar(!isSidebar);
    }
    
    return (
        <React.Fragment>
            <nav className='navbar'>
            <div className="navbar-container">
                   <List className="bi bi-list list-icon" onClick={showSidebar}/>
                   <Link to="/" className="navbar-logo noSelect" onClick={closeMobileMenu}>
                      Whiteboard    
                   </Link>    
                   <div className='menu-icon' onClick={handleClick}>
                       <i className={click ? 'fas fa-times' : 'fa fa-bars'}></i>
                   </div>
                   <ul className={click ? 'nav-menu active' : 'nav-menu'}>
                       <li className='nav-item noSelect'>
                           <Link to='/' className='nav-links' onClick={closeMobileMenu}>
                               HOME
                           </Link>
                       </li>
                       <li className='nav-item noSelect'>
                           <Link to='/account' className='nav-links' onClick={closeMobileMenu}>
                               ACCOUNT
                           </Link>
                       </li>
                       <li className='nav-item noSelect'>
                           <Link to='/' className='nav-links' onClick={closeMobileMenu}>
                                LOG OUT
                           </Link>
                       </li>
                   </ul>
                </div>     
            </nav>
            <Sidebar isSidebar={isSidebar} />
            <GallerySection isSidebar={isSidebar}/>
        </ React.Fragment>
    )}

export default Navbar

