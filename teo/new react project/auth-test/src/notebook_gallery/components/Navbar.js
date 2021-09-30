import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import './Navbar.css'
import { List } from 'react-bootstrap-icons';
import { Sidebar } from './Sidebar'
import { GallerySection } from './GallerySection';


const Navbar = () => {

    const [isSidebar, setIsSidebar] = useState(true);

    return (
        <React.Fragment>
            <nav className='nb-navbar'>
                <div className="navbar-container">
                   <List className="bi bi-list list-icon" onClick={() => setIsSidebar(!isSidebar)}/>
                   <Link to="/" className="navbar-logo noSelect">
                        <img src={'logo.PNG'} style={{width: 150}}/>
                   </Link>    
                </div>   
                <ul className='nb-nav-menu'>
                       <div className='account-section'>
                            <div className='photo' style={{'backgroundImage' : 'url(https://as1.ftcdn.net/v2/jpg/03/46/83/96/1000_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg'}}></div>
                            <p className='username'>Username Here</p>
                       </div>
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
            </nav>
            <Sidebar 
                repo_sidebarState={[isSidebar, setIsSidebar]} />
        </ React.Fragment>
    )}

export default Navbar

