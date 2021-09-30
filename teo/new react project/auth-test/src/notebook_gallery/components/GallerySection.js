import React, { useState, useRef } from 'react';
import './GallerySection.css'
import { Sidebar } from './Sidebar';
import { Card } from './Card';
import { useFetch } from '../useFetch';
import { AddModal } from './AddModal';
import { DeleteModal } from './DeleteModal';
import moment from 'moment'; 
import { useEffect } from 'react';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { BsBoxArrowInLeft } from "react-icons/bs";
import Button from '@mui/material/Button';
import Grow from '@mui/material/Grow';
import { Dropdown } from 'semantic-ui-react'


// Fake Json APIs for testing
const notebook_url = 'https://mocki.io/v1/5b073560-9d5c-4289-9d07-790ae8b59876';  
// const cover_url = 'https://mocki.io/v1/590c2c5a-a010-49cb-b0e3-2b1524921e8f';
const cover_url = 'https://mocki.io/v1/5664ee9c-96c0-416b-876c-f15dfc1d4337';


export const randomNumber = (min, max) => {
    const r = Math.random()*(max-min) + min
    return Math.floor(r)
}

const sortOptions = [
    {
        key: '0',
        text: 'no specific order',
        value: 'no specific order',
      },
    {
        key: '1',
        text: 'sorted alphabetically',
        value: 'sorted alphabetically',
      },
      {
        key: '2',
        text: 'sorted by date',
        value: 'sorted by date',
      },
      {
        key: '3',
        text: 'recently used',
        value: 'recently used',
      }
]

export const GallerySection = (props) => {
    const repo_sidebarValue = props.isSidebar;
    const [folderState, setFolderState] = props.folderState;

    const notebooks = useFetch(notebook_url);
    const covers = useFetch(cover_url);

    const [inputState, setInputState] = useState('');

    const [visibleNotebooks, setVisibleNotebooks] = useState([]);
    const [modalShow, setModalShow] = useState(false);
    const [delModalShow, setDelModalShow] = useState(false);
    const [title, setTitle] = useState('Untitled');
    const [idState, setIdState] = useState(-1);
    const [optionState, setOptionState] = useState(false);
    const myFolders= props.allFolders;
    const [folderChoice, setFolderChoice] = useState('');
    const [folderName, setFolderName] = useState('');

    const [selectedOption, setSelectedOption] = useState('');
    const [isSelected, setIsSelected] = useState(false);


    const setMyNotebooks = () => {
        const folderId = folderState;
        setVisibleNotebooks(notebooks);
        if (folderId === 'all')
        {
            setVisibleNotebooks((notebooks) => {
                return notebooks.filter((notebook) => !notebook.isDeleted)
            })
        }
        else
        if (folderId === 'deleted')
        {
            setVisibleNotebooks((notebooks) => {
                return notebooks.filter((notebook) => notebook.isDeleted)
            })
        }
        else
        if (folderId === 'favorites')
        {
            setVisibleNotebooks((notebooks) => {
                return notebooks.filter((notebook) => notebook.isFavorite && !notebook.isDeleted)
            })
        }
        else
        {
            setVisibleNotebooks((notebooks) => {
                return notebooks.filter((notebook) => notebook.folder_id.toString() === folderId && !notebook.isDeleted)
            })
        }
    }

    useEffect(() => {
        setMyNotebooks();
        if (inputState !== '') 
        {
            const keyword = inputState.toLowerCase();
            setVisibleNotebooks((notebooks) => {
                return notebooks.filter((notebook) => notebook.title.toString().toLowerCase().search(keyword) !== -1)
            })
        }
    }, [inputState, folderState, notebooks])

    const countNameOccurences = () => {
        const re1 =  new RegExp(title);
        const re2 = /\(([0-9])+\)/;
        var flags = (re1.flags + 
            re2.flags).split("")
                .sort().join("") 
        var regex = new RegExp(re1.source
                    + re2.source, flags);
        return notebooks.reduce((a, notebook) => (!notebook.isDeleted && title === notebook.title || regex.test(notebook.title) ? a + 1 : a), 0)
    }


    const addNewNotebook = () => {
        setModalShow(false);
        const randomIndex = randomNumber(0, covers.length - 1);
        const myPhotoUrl = covers[randomIndex].photo_url;
        const titleOccur = countNameOccurences();
        const eventualTitle = title.concat('(', titleOccur, ')')
        const newNb = {
            id : new Date().getTime().toString(),
            title : `${titleOccur > 0 ? eventualTitle : title}`,
            date : moment().format("DD/MM/YYYY"),
            isFavorite : false,
            image : `${myPhotoUrl}`,
            folder_id : `${folderState !== 'all' ? folderState : folderChoice}`,
            isDeleted: false
        }
        notebooks.push(newNb);
        setTitle('Untitled');
        setMyNotebooks();
    }

    const handleSortChange = (event, data) => {
        if (event.target.textContent === 'no specific order');
        {
            notebooks.sort((a,b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0))
            setMyNotebooks();
        }   
        if (event.target.textContent === 'sorted alphabetically')
        {
            notebooks.sort((a,b) => (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0))
            setMyNotebooks();
        }
        if (event.target.textContent === 'sorted by date')
        {
            notebooks.sort(function(a, b){
                var aa = a.date.split('/').reverse().join(),
                    bb = b.date.split('/').reverse().join();
                return aa < bb ? -1 : (aa > bb ? 1 : 0);
            });
            setMyNotebooks();
        }
    }

    useEffect(() => {
        if (isSelected)
        {
            if (selectedOption === 'fav')
                editFavorites();
            if (selectedOption === 'delete')
                deleteNotebook();
            if (selectedOption === 'restore')
                restoreNotebook();
            if (selectedOption === 'remove')
                setDelModalShow(true);
            setIsSelected(false);
        }
    })

    const editFavorites = () => {
        const id = idState;
        const index = notebooks.findIndex((notebook => notebook.id === id));
        notebooks[index].isFavorite = !notebooks[index].isFavorite;
        setMyNotebooks();
    }

    const deleteNotebook = () => {
        const id = idState;
        const index = notebooks.findIndex((notebook => notebook.id === id));
        notebooks[index].isDeleted = true;
        notebooks[index].isFavorite = false;
        setMyNotebooks();
    }

    const restoreNotebook = () => {
        const id = idState;
        const index = notebooks.findIndex((notebook => notebook.id === id));
        notebooks[index].isDeleted = false;
        setMyNotebooks();
    }

    const removeNotebook = () => {
        const id = idState;
        const index = notebooks.findIndex((notebook => notebook.id === id));
        notebooks.splice(index, 1);
        setDelModalShow(false);
        setMyNotebooks();
    }

    useEffect(() => {
        if (folderState !== 'all') {
            if (folderState === 'favorites')  setFolderName('Favorites');
            else
            if (folderState === 'deleted') setFolderName('Trashcan');
            else{
                const fol = myFolders.find(folder => folder.id.toString() === folderState.toString())
                setFolderName(fol.name)
            }      
        }
    })

    return (
        <>
        <div className='gallery'>
            <div className='gallery-header'>
                <input className='gallery-input' 
                        type="text" 
                        placeholder="   Search for files.." 
                        name='Search' 
                        onChange={event => setInputState(event.target.value)}/>
                {
                folderState === 'all' ||
                <div className='folder-page'>
                    <div className='back' onClick={() => setFolderState('all')}>
                        <BsBoxArrowInLeft style={{'fontSize': '20px', 'fontWeight' : '2px'}} className='back-btn'/>
                        <p className='back-text'>View all notebooks</p>
                    </div>
                    <h3 className='folder-header'>{folderName}</h3>
                </div>
                }   
                {
                folderState === 'all' && 
                <div className='sort'>
                    Show {' '}
                    <Dropdown
                    inline
                    options={sortOptions}
                    defaultValue={sortOptions[0].value}
                    onChange={handleSortChange}
                    />
                </div>
                }
            </div>
                {folderState === 'all' ||
                <hr className='hr3'></hr>
                }
                <div className={`${repo_sidebarValue ? 'card-section--small' : 'card-section--big'}`}>
                {
                    visibleNotebooks.map((notebook) => {
                    return (
                        <Card  
                        key = {notebook.id}
                        id = {notebook.id}
                        title = {notebook.title}
                        date = {notebook.date}
                        isFavorite = {notebook.isFavorite}
                        isDeleted = {notebook.isDeleted}
                        image = {notebook.image}
                        idState = {[idState, setIdState]}
                        optionState = {[optionState, setOptionState]}
                        selectedOption={[selectedOption, setSelectedOption]}
                        isSelected={[isSelected, setIsSelected]}
                        page = {folderState}
                        />)
                    })
                }
                </div>
                {
                    folderState !== 'favorites' && folderState !== 'deleted' &&
                    // <img src="https://i.ibb.co/tbk3M2c/Buton-modified.png" style={{'transition': 'transform 0.2s'}} alt="" className='add-btn' onClick={() => setModalShow(true)}/>
                    <AddCircleIcon style={{'fontSize': '65px', 'transition': 'transform 0.2s'}} className='add-btn' onClick={() => setModalShow(true)}/>
                }
        </div>
        <AddModal
            show={modalShow}
            type='notebook'
            state={[title, setTitle]}
            onHide={() => setModalShow(false)}
            add={() => addNewNotebook()}
            page={folderState}
            fldrs={myFolders}
            folderName={[folderChoice, setFolderChoice]}
            />
        <DeleteModal 
            show={delModalShow}
            onHide={() => setDelModalShow(false)}
            remove={removeNotebook}
        />
        </>
    )
}