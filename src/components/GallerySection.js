import React, { useState, useRef } from 'react';
import './GallerySection.css'
import { Card } from './Card';
import { PlusCircle } from 'react-bootstrap-icons';
import { useFetch } from '../useFetch';
import { AddModal } from './AddModal';
import moment from 'moment'; 
import { useEffect, useFocus } from 'react';

// Fake Json APIs for testing
const notebook_url = 'https://mocki.io/v1/d3d6964d-7855-4b0c-a27b-8c051be2fb71';  
const cover_url = 'https://mocki.io/v1/aa4a589d-523f-49f9-9774-7c6459e2cea4';

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
        const randomIndex = Math.floor(Math.random() * covers.length)
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
            <PlusCircle className="bi bi-plus-circle add-btn" onClick={() => setModalShow(true)}/>
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