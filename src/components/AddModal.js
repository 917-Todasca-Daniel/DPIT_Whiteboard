import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from "react-dom";
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";
import './AddModal.css'

export const AddModal = (props) => {
  const inputElement = useRef(null);
  const [title, setTitle] = props.titleState;

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
        <Modal.Body className='w-100 text-center'>
          <h4 className='mdl-text'>ENTER THE NAME FOR YOUR NOTEBOOK</h4>
          <input autoFocus className='mdl-input' type="text" ref={inputElement} onChange={event => setTitle(event.target.value)}/>
        </Modal.Body>
        <Modal.Footer>
          <button className='button-28' onClick={props.onHide, props.addNotebook}>Open Notebook</button>
          <button className='button-28' onClick={props.onHide}>Cancel</button>
        </Modal.Footer>
      </Modal>
    );
  }