import * as CanvasDraw from "./CanvasDraw";
import React, { useState, useRef } from 'react';

var history = [];
var redo = [];
var canvasList = [];
var pageCount = 1;
var moveSpeed = 100;
var activeCanvas = null;

var textboxOCR = null;

const Paste = () => {
    if (activeCanvas) activeCanvas.pasteSelection();
}

const Undo = () => {
    StopSelection();
    if (history.length === 0) return;
    const cmd = history.pop();
    redo.push(cmd);
    if (cmd.type === "draw") {
        cmd.canvas.undo();
    }
}

const Redo = () => {
    StopSelection();
    if (redo.length === 0) return;
    const cmd = redo.pop();
    history.push(cmd);
    if (cmd.type === "draw") {
        cmd.canvas.redo();
    }
}

const OnCanvasDraw = (ref) => {
    redo = [];
    history.push({
        type: "draw",
        canvas: ref,
    });
}

const MoveSelection = (x, y) => {
    if (activeCanvas) activeCanvas.AddSelection(x*moveSpeed, y*moveSpeed);
}

const StopSelection = () => {
    if (activeCanvas) activeCanvas.handleSelectionEnd();
}

const updateActiveCanvas = (ref, textOCR) => {
    if (textboxOCR) {
        textboxOCR.defaultValue = textOCR;
    }
    else console.log("aoleo");
    if (activeCanvas !== ref && activeCanvas) activeCanvas.handleSelectionEnd();
    activeCanvas = ref;
}

var update = () => {};

const MultiPageCanvas = (brushThickness, brushColor, bEraseCanvas, bDisableCanvas, bSmooth, changeOCRText, zoomScale, OCRRef, bSelect) => {
    textboxOCR = OCRRef.current;
    const [value, setValue] = useState(0); 
    canvasList = [];
    const ref = useRef(null);
    update = () => { setValue(value+1); }
    var canvasHTMLs = [];
    var marginValue = "0";
	for (var i=0; i<pageCount; ++i) {
        if (i === 0) marginValue = "0";
        else marginValue = "5em";
		canvasHTMLs.push(<CanvasDraw 
			style		={{boxShadow: "0px 10px 35px 1px #969696", marginTop: marginValue}}
			lazyRadius	={0}
			canvasWidth	={2480} 
			canvasHeight={3508}
            ref         ={ref}
            onDrawFinish={OnCanvasDraw}
            onSelectFinish={updateActiveCanvas}      
            changeOCRText={changeOCRText}
            bSmooth     ={bSmooth}
			brushRadius	={brushThickness}
			brushColor	={brushColor}
			eraseCanvas	={bEraseCanvas}
			disabled	={bDisableCanvas}
			scale		={zoomScale}
            bSelect     ={bSelect}
			hideGrid	={true}
			imgSrc		={"https://i.ibb.co/KhcjQ64/lines.jpg"}
			/>);
        canvasList.push(ref.current);
	}
	return canvasHTMLs;
}

const IncremenentPageCount = () => {
    update();
    pageCount += 1;
}

export { Undo, Redo, OnCanvasDraw, MultiPageCanvas, IncremenentPageCount, Paste, MoveSelection, StopSelection }