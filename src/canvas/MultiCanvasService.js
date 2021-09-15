import CanvasDraw from "./CanvasDraw";
import React, { useState, useRef } from 'react';

var history = [];
var redo = [];
var canvasList = [];
var pageCount = 1;
var moveSpeed = 100;

const Paste = () => {
    console.log("paste");
}

const Undo = () => {
    if (history.length === 0) return;
    const cmd = history.pop();
    redo.push(cmd);
    if (cmd.type === "draw") {
        cmd.canvas.undo();
    }
}

const Redo = () => {
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
    canvasList.forEach((canvas) => {
        canvas.AddSelection(x*moveSpeed, y*moveSpeed);
    });
}

const StopSelection = () => {
    canvasList.forEach((canvas) => {
        canvas.handleSelectionEnd();
    });
}

var update = () => {};

const MultiPageCanvas = (brushThickness, brushColor, bEraseCanvas, bDisableCanvas, zoomScale, bSelect) => {
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