import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from "react-dom";
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";
import './DeleteModal.css'

export const DeleteModal = (props) => {

    return (
      <Modal className='mdl-body'
        {...props}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className='w-100 text-center' id="contained-modal-title-vcenter" >
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className='w-100 text-center' style={{'height' : '120px !important'}}>
          <h4 className='mdl-text'>Are you sure you want to permanently delete this notebook?</h4>
        </Modal.Body>
        <Modal.Footer>
          <button className='button-2' onClick={props.onHide, props.remove}>Yes</button>
          <button className='button-2' onClick={props.onHide}>Cancel</button>
        </Modal.Footer>
      </Modal>
    );
  }