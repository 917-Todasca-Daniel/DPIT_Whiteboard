import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GiWhiteBook } from 'react-icons/gi';
import { FaBars, FaTimes } from 'react-icons/fa';
import { Button } from './Button';
import './Navbar.css';
import { IconContext } from 'react-icons/lib'


function Navbar() {
    const [click, setClick] = useState(false)
    const [button, setButton] = useState(true);

    const handleClick = () => setClick(!click);
    const closeMobileMenu = () => setClick(false);

    const showButton = () => {
        if (window.innerWidth <= 960) {
            setButton(false)
        }
        else {
            setButton(true)
        }
    }
    
    useEffect(() => {
        showButton();
    }, []);
    window.addEventListener('resize', showButton);

    return (
        <IconContext.Provider value={{ color: '#028174'}}>
            <div className="navbar">
                <div className="navbar-container container">
                    <Link to= '/' className="navbar-logo" onClick={closeMobileMenu}>
                        <GiWhiteBook className='navbar-icon'></GiWhiteBook>
                        WhiteBoard
                    </Link>

                    <div className="menu-icon" onClick={handleClick}>
                        {click ? <FaTimes /> : <FaBars /> }
                    </div>
                    <ul className={click ? 'nav-menu active' : 'nav-menu'}> 
                        <li className="nav-item">
                            <Link to='/how-it-works' className="nav-links" onClick={closeMobileMenu}>
                                How it works
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to='/about-us' className="nav-links" onClick={closeMobileMenu}>
                                About us
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to='/contact' className="nav-links" onClick={closeMobileMenu}>
                                Contact
                            </Link>
                        </li>
                        <li className="nav-btn">
                            {button ? (
                                <Link to='/log-in' className="btn-link" onClick={closeMobileMenu}>
                                    <Button buttonStyle='btn--outline-dark'>
                                    Log In
                                    </Button>
                                </Link>
                            ) : (
                                <Link to='/log-in' className="btn-link" onClick={closeMobileMenu}>
                                    <Button buttonStyle='btn--outline-dark'
                                            buttonSize='btn--mobile'>
                                    Log In
                                    </Button>
                                </Link>   
                            )}
                        </li>
                        <li className="nav-btn">
                            {button ? (
                                <Link to='/sign-up' className="btn-link" onClick={closeMobileMenu}>
                                    <Button buttonStyle='btn--outline-light'>
                                    Sign Up
                                    </Button>
                                </Link>
                            ) : (
                                <Link to='/sign-up' className="btn-link" onClick={closeMobileMenu}>
                                    <Button buttonStyle='btn--outline-light'
                                            buttonSize='btn--mobile'>
                                    Sign Up
                                    </Button>
                                </Link>   
                            )}
                        </li>
                    </ul>
                </div>
            </div>
        </IconContext.Provider>
    )
}

export default Navbar
