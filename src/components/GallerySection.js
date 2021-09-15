import React, { useState, useRef } from 'react';
import './GallerySection.css'
import { Card } from './Card';
import { PlusCircle } from 'react-bootstrap-icons';
import { useFetch } from '../useFetch';
import { AddModal } from './AddModal';
import moment from 'moment'; 
import { useEffect } from 'react';
import AddCircleIcon from '@material-ui/icons/AddCircle';


// Fake Json APIs for testing
const notebook_url = 'https://mocki.io/v1/e6c8084f-0424-4cd2-a989-8396d9e02d44';  
const cover_url = 'https://mocki.io/v1/590c2c5a-a010-49cb-b0e3-2b1524921e8f';


export const randomNumber = (min, max) => {
    const r = Math.random()*(max-min) + min
    return Math.floor(r)
}

export const GallerySection = (props) => {
    const sidebarValue = props.isSidebar;
    const notebooks = useFetch(notebook_url);
    const covers = useFetch(cover_url);

    const [inputState, setInputState] = useState('');
    const [visibleNotebooks, setVisibleNotebooks] = useState([]);
    const [modalShow, setModalShow] = useState(false);
    const [title, setTitle] = useState('Untitled');

    useEffect(() => {
        if (inputState === '') 
            setVisibleNotebooks(notebooks);
        else
        // Search mode is on
        {
            const keyword = inputState.toLowerCase();
            setVisibleNotebooks(notebooks);
            setVisibleNotebooks((notebooks) => {
                return notebooks.filter((notebook) => notebook.title.toString().toLowerCase().search(keyword) !== -1)
            })
        }
    })

    const addNewNotebook = () => {
        setModalShow(false);
        const randomIndex = randomNumber(0, covers.length - 1);
        const myPhotoUrl = covers[randomIndex].photo_url;
        const newNb = {
            id : notebooks.length + 1,
            title : title,
            date : moment().format("DD/MM/YYYY"),
            isFavorite : false,
            image : `${myPhotoUrl}`
        }
        notebooks.push(newNb);
        setTitle('Untitled');
    }


    return (
        <>
        <div className={`${sidebarValue ? 'gallery-small' : 'gallery-big'}`}>
            <input className='gallery-input' 
                    type="text" 
                    placeholder="   search for files.." 
                    name='Search' 
                    onChange={event => setInputState(event.target.value)}/>
            <AddCircleIcon style={{'fontSize': '65px', 'transition': 'transform 0.2s'}} className='add-btn' onClick={() => setModalShow(true)}/>
            {
                <div className={`${sidebarValue ? 'card-section--small' : 'card-section--big'}`}>
               {
                    visibleNotebooks.map((notebook) => {
                    return (
                        <Card  
                        key = {notebook.id}
                        title = {notebook.title}
                        date = {notebook.date}
                        isFavorite = {notebook.isFavorite}
                        image = {notebook.image}
                        />
                    )
                })
               }
                </div>
            }
        </div>
        <AddModal
            show={modalShow}
            titleState={[title, setTitle]}
            onHide={() => setModalShow(false)}
            addNotebook={() => addNewNotebook()}
            />
        </>
    )
}