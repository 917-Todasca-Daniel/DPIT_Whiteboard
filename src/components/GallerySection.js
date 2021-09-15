import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import './GallerySection.css'
import { Card } from './Card';
import { PlusCircle } from 'react-bootstrap-icons';
import { useFetch } from '../useFetch';
import { AddModal } from './AddModal';
import moment from 'moment'; 
import { useEffect, useFocus } from 'react';

const url = 'https://mocki.io/v1/d3d6964d-7855-4b0c-a27b-8c051be2fb71';

export const GallerySection = (props) => {
    const sidebarValue = props.isSidebar;
    const notebooks = useFetch(url);

    const [inputState, setInputState] = useState('');
    const [visibleNotebooks, setVisibleNotebooks] = useState([]);
    const [modalShow, setModalShow] = React.useState(false);

    const handleSearch = (event) => {
        event.preventDefault();
        setInputState(event.target.value)
        if (inputState !== '')
        {
            setVisibleNotebooks((notebooks) => {
                return notebooks.filter((notebook) => notebook.title.toLowerCase().search(inputState) !== -1)
            })
        }
        else{
            setVisibleNotebooks(notebooks);
        }
    }

    useEffect(() => {
        if (inputState !== '')
        {
            setVisibleNotebooks((visibleNotebooks) => {
                return visibleNotebooks.filter((notebook) => notebook.title.search(inputState) !== -1)
            })
        }
        else
        {
            setVisibleNotebooks(notebooks);
        }
      }, [inputState])

    useEffect(() => {
        if(inputState === '')
            {
                setVisibleNotebooks(notebooks);
            }
        else
        {
            handleSearch();
        }
    }, [notebooks])

    const addNewNotebook = () => {
        setModalShow(false);
        const newNb = {
            id : notebooks.length + 1,
            title : 'Untitled',
            date : moment().format("DD/MM/YYYY"),
            isFavorite : false,
            image : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQp90VgIRjzVQuWy6imcYJOKdt0KvrI-F8RowkaapZuG2kkdGiGx9Gc6xjUH_mOzZznruQ&usqp=CAU'
        }
        notebooks.push(newNb);
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
            onHide={() => setModalShow(false)}
            addNotebook={() => addNewNotebook()}
            />
        </>
    )
}