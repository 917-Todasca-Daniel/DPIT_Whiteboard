import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from "react-dom";
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";
import './AddModal.css'
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { ChatLeftTextFill } from 'react-bootstrap-icons';
import 'semantic-ui-css/semantic.min.css'
import { Dropdown } from 'semantic-ui-react'


export const AddModal = (props) => {
  const inputElement = useRef(null);
  const optionElement = useRef(null);
  const [state, setState] = props.state;
  const type = props.type;
  const addText = `${type === 'folder' ? 'Add Folder' : 'Open Notebook'}`
  const folderArray = props.fldrs
  const [choice, setChoice] = props.folderName;

  const optionArray = folderArray.map(folder => {
    return { key: folder.id, value: folder.id, text: folder.name };
  });

  const handleChange = (event) => {
    const myFolder = folderArray.find(folder => folder.name === event.target.textContent)
    setChoice(myFolder.id);
  };

  useEffect(() => {
    if (inputElement.current) {
      inputElement.current.focus();
    }
  }, []);

    return (
      <Modal className='mdl-body'
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className='w-100 text-center' id="contained-modal-title-vcenter">
          </Modal.Title>
        </Modal.Header>
        {
          props.page === 'all' ?
          (
    
            <Modal.Body className='w-100 text-center all-folder'>
            <h4 className='mdl-text'>ENTER THE NAME FOR YOUR NOTEBOOK AND PICK THE FOLDER WHERE YOU WILL SAVE IT</h4>
            <div class='input-folder-layout'>
              <input autoFocus placeholder="    Enter name..." className='mdl-input' style={{'margin-right': '20px'}} type="text" ref={inputElement} onChange={event => setState(event.target.value)}/>
              {
                props.page === 'all' &&
                <Dropdown
                style = {{'width' : '170px', 'height' : '30px', 'margin-top' : '27px', 'margin-left' : '60px', 'border' : '1.5px solid #56c9ac'}}
                placeholder='Select Folder'
                fluid
                selection
                options={optionArray} 
                onChange={handleChange}/>
              }
            </div>
            </Modal.Body>
          )
          :
          (
            <Modal.Body className='w-100 text-center'>
            <h4 className='mdl-text'>ENTER THE NAME FOR YOUR {type === 'folder' ? 'FOLDER' : 'NOTEBOOK'}</h4>
            <input autoFocus placeholder="    Enter name..." className='mdl-input' type="text" ref={inputElement} onChange={event => setState(event.target.value)}/>
            </Modal.Body>
          )
        }
        <Modal.Footer>
          <button className='button-28' onClick={props.onHide, props.add}>{addText}</button>
          <button className='button-28' onClick={props.onHide}>Cancel</button>
        </Modal.Footer>
      </Modal>
    );
  }