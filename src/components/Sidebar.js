import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css'
import { Folder, Journals, FileEarmarkPlus } from 'react-bootstrap-icons';

export const Sidebar = (isSidebar) => {
    const sidebarValue = isSidebar.isSidebar;
    
    return (
    <React.Fragment>
    <div className={`${sidebarValue ? 'sidebar' : 'sidebar-closed'}`}>
        <div className='sidebar-container'>
        {
        sidebarValue &&
        <>
        <div className='input-section'>
            <input className='inputStyle noSelect' type="text" placeholder='   search for folders..' name='Search'/>
            <FileEarmarkPlus className="bi bi-file-earmark-plus add-file-button" onClick={() => {console.log('clicked')}}/>
        </div>
        <ul className='sidebar-list'>
            <li className='sidebar-item noSelect'>
                <div className='sidebar-item'>
                    <Folder class="bi bi-folder icon yellow"></Folder>
                    Folders
                </div>
            </li>
        </ul>
        </>
        }
        </div>
    </div>
    </ React.Fragment>
    );
  };
   
  export default Sidebar;