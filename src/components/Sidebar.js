import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css'
import { styled, useTheme } from '@mui/material/styles';
import FolderIcon from '@material-ui/icons/Folder';
import { useFetch } from '../useFetch';
import { randomNumber } from './GallerySection';
import CreateNewFolderIcon from '@material-ui/icons/CreateNewFolder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DeleteIcon from '@material-ui/icons/Delete';
import { GallerySection } from './GallerySection';
import { AddModal } from './AddModal';
import { Collapse } from "react-collapse";
import Switch from '@mui/material/Switch';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Drawer from '@mui/material/Drawer';
import { Input } from 'semantic-ui-react';


const folder_url ='https://mocki.io/v1/74c041f6-8104-4239-9ff2-208e32ec6f61';
const colors = ['#e6f057', '#37b9e4', '#e96b6b', '#912eaa', '#828282', ' #84be6d']

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
      flexGrow: 1,
      padding: theme.spacing(3),
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginTop: 80,
      marginLeft: 350,
      ...(open && {
        transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
      }),
    }),
  );

export const Sidebar = (props) => {
    const [sidebarState, setSidebarState] = props.sidebarState;
    const fdlr = useFetch(folder_url);

    const [folders, setFolders] = useState([]);
    const [input, setInput] = useState('');
    const [modalShow, setModalShow] = useState(false);
    const [name, setName] = useState('Untitled');
    const [notesFromFolder, setNotesFromFolder] = useState('all');
    const [showFolders, setShowFolders] = useState(true);
    const [checked, setChecked] = useState(true);
    const [folderChoice, setFolderChoice] = useState('');

    const handleChange = () => {
        setChecked(false);
        setTimeout(setChecked(true), 3000);
      };

    const countNameOccurences = () => {
        const re1 =  new RegExp(name);
        const re2 = /\(([0-9])+\)/;
        var flags = (re1.flags + 
            re2.flags).split("")
                .sort().join("") 
        var regex = new RegExp(re1.source
                    + re2.source, flags);
        return folders.reduce((a, folder) => (name === folder.name || regex.test(folder.name) ? a + 1 : a), 0)
    }

    useEffect(() => {
        if (input === '') 
            setFolders(fdlr);
        else
        {
            if (!showFolders) 
                setShowFolders(true);
            const keyword = input.toLowerCase();
            setFolders(fdlr);
            setFolders((folders) => {
                return folders.filter((folder) => folder.name.toString().toLowerCase().search(keyword) !== -1)
            })
        }
    })

    const addFolder= () => {
        setModalShow(false);
        const randomIndex = randomNumber(0, colors.length - 1);
        const nameOccur = countNameOccurences();

        const finalName = `${nameOccur === 0 ? name : name.concat('(', nameOccur, ')')}`;
        const newFolder = {
            id: `${fdlr.length}` + 1,
            name: `${finalName}`,
            color: `${colors[randomIndex]}`
        }
        fdlr.push(newFolder);
        setName('Untitled');
    }
    

    return (
    <React.Fragment>
    <React.Fragment>
          <Drawer 
            variant="persistent"
            anchor="left"
            open={sidebarState}
          >
        <div className='sidebar-container'>
            <React.Fragment>
                <div className='input-section'>
                    <input className='inputStyle noSelect' 
                    type="text" placeholder='   search for folders..' 
                    name='Search'
                    onChange={event => setInput(event.target.value)}
                    />
                    <CreateNewFolderIcon className="add-file-button" style={{'fontSize': '34px', 'transition': 'transform 0.2s'}} onClick={() => setModalShow(true)}/>
                </div>
                <div className='sidebar-list'>
                <div className='sidebar-bigItem noSelect' onClick={() => {setShowFolders(!showFolders)}}>
                    <FolderIcon className=" icon" style={{ 'fontSize' : '27px'}}/>
                    Folders
                </div>
                <Collapse isOpened={showFolders}>
                    <ul className='sidebar-list'>
                        {
                            folders.map((folder) => {
                                return (
                                <li className='sidebar-item noSelect' onClick={handleChange, () => setNotesFromFolder(`${folder.id}`)}>
                                    <FolderIcon className="icon" style={{'color' : folder.color}}/>
                                    {folder.name}
                                </li>
                                )
                            })
                        }
                    </ul>
                </Collapse>
                <div className='sidebar-bigItem noSelect' onClick={handleChange, () => setNotesFromFolder('favorites')}>
                    <FavoriteIcon className="icon" style={{'color' : '#e97979', 'fontSize' : '28px'}}/>
                    Favorites
                </div>
                <div className='sidebar-bigItem noSelect' onClick={handleChange, () => setNotesFromFolder('deleted')}>
                    <DeleteIcon className="icon" style={{'color' : '#727272', 'fontSize' : '28px'}}/>
                    Trashcan
                </div>
                </div>
            </ React.Fragment>
        </div>
          </Drawer>
    </React.Fragment>
    <Main open={!sidebarState}>
        <GallerySection 
        isSidebar={sidebarState} 
        switchState={[checked, setChecked]}
        folderState={[notesFromFolder, setNotesFromFolder]}
        allFolders={folders}
        />
    </Main>
    <AddModal
        show={modalShow}
        type='folder'
        state={[name, setName]}
        onHide={() => setModalShow(false)}
        add={() => addFolder()}
        fldrs={folders}
        folderName={[folderChoice, setFolderChoice]}
        />
    </ React.Fragment>
    );
  };
   
  export default Sidebar;