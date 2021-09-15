import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css'
import { Folder, Journals, FileEarmarkPlus } from 'react-bootstrap-icons';
import FolderIcon from '@material-ui/icons/Folder';
import { useFetch } from '../useFetch';
import { randomNumber } from './GallerySection';

const folder_url ='https://mocki.io/v1/74c041f6-8104-4239-9ff2-208e32ec6f61';
const colors = ['#e6f057', '#37b9e4', '#e96b6b', '#912eaa', '#828282', ' #84be6d']

export const Sidebar = (isSidebar) => {
    const sidebarValue = isSidebar.isSidebar;
    const fdlr = useFetch(folder_url);
    const [folders, setFolders] = useState(fdlr);

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
            {
                fdlr.map((folder) => {
                    return (
                    <li className='sidebar-item noSelect'>
                        <FolderIcon className="icon" style={{'color' : folder.color}}/>
                        {folder.name}
                    </li>
                    )
                })
            }
        </ul>
        </>
        }
        </div>
    </div>
    </ React.Fragment>
    );
  };
   
  export default Sidebar;