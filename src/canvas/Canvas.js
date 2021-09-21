import React, { useRef, useState } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { SwatchesPicker  } from 'react-color';
import ComboBox from 'react-responsive-combo-box'

import IconButton from '@material-ui/core/IconButton';
import CreateIcon from '@material-ui/icons/Create';
import ClearAllIcon from '@material-ui/icons/ClearAll';
import UndoIcon from '@material-ui/icons/Undo';
import RedoIcon from '@material-ui/icons/Redo';
import OpenWithIcon from '@material-ui/icons/OpenWith';
import FormatColorTextIcon from '@material-ui/icons/FormatColorText';
import ShareIcon from '@material-ui/icons/Share';
import HomeIcon from '@material-ui/icons/Home';
import Box from '@material-ui/core/Box'
import PhotoSizeSelectLargeIcon from '@material-ui/icons/PhotoSizeSelectLarge';

import 'react-responsive-combo-box/dist/index.css'
import './clickthrough.css'

import { Undo, Redo, MultiPageCanvas, IncremenentPageCount, Paste, MoveSelection, StopSelection } from './MultiCanvasService.js'

const DisableScroll = () => {
	const safeDocument = typeof document !== 'undefined' ? document : {};
	const { body } = safeDocument;
    if (!body || !body.style) return;
    body.style.overflow = 'hidden'; 
	body.style.padding = 0;
	body.style.margin = 0;
}

DisableScroll();

var drawingStyle = "freeform";
var brushThicknessMap = new Map([
	['eraser', 80], ['freeform', 3],
])
var brushSizeOptions = [3, 6, 20, 80];

const CanvasEditor = () => {
	const [bEraseCanvas, 	setErase] 		= useState(false);
	const [bDisableCanvas, 	disableCanvas] 	= useState(false);
	const [bPanning, 		setPanning] 	= useState(true);
	const [bSelect, 		setSelection] 	= useState(false);

	const [brushColor, 		setBrushColor] 		= useState("#000000");
	const [brushThickness, 	setBrushThickness] 	= useState(3);
	const [zoomScale, 		setZoomScale] 		= useState(1);

	const zoomPanPitchRef 	= useRef(null);
	const selectionIconRef 	= useRef(null);
	const brushComboBoxRef 	= useRef(null);
	const eraserIconRef 	= useRef(null);
	const freeformIconRef 	= useRef(null);
	const panningIconRef 	= useRef(null);
	const colorPickerRef 	= useRef(null);

	const drawingStylesBehaviours = new Map([
		['eraser', 		() => { setErase(true); 	setPanning(true); 	disableCanvas(false);	setSelection(false); 	}],
		['freeform', 	() => { setErase(false); 	setPanning(true); 	disableCanvas(false);	setSelection(false); 	}],
		['panning',		() => { setErase(false); 	setPanning(false); 	disableCanvas(true);	setSelection(false); 	}],
		['selection',	() => { setErase(false); 	setPanning(true); 	disableCanvas(false);	setSelection(true); 	}],
	]);

	const iconRefMap = new Map([
		['eraser', 		eraserIconRef],
		['freeform', 	freeformIconRef],
		['panning',		panningIconRef],
		['selection',	selectionIconRef],
	]);

	const setDrawingStyle = (newDrawingStyle) => {
		StopSelection();
		iconRefMap.get(drawingStyle).current.style.backgroundColor = "transparent";
		brushThicknessMap.set(drawingStyle, brushThickness);
		drawingStylesBehaviours.get(newDrawingStyle)();
		drawingStyle = newDrawingStyle;
		setBrushThickness(brushThicknessMap.get(drawingStyle));
		iconRefMap.get(drawingStyle).current.style.backgroundColor = "#E8E8E8";
		if (drawingStyle === "panning") return;
		if (brushThicknessMap.get(drawingStyle))
		brushComboBoxRef.current.innerHTML = brushThicknessMap.get(drawingStyle);
	}

	const handleKeyPress = (event) => {
		if (event.ctrlKey) {
			if (event.keyCode === 90) Undo();
			else if (event.keyCode === 89) Redo();
			else if (event.keyCode === 86) Paste();
		}
		if (event.keyCode === 37) MoveSelection(-1, 0);
		else if (event.keyCode === 38) MoveSelection(0, -1);
		else if (event.keyCode === 39) MoveSelection(1, 0);
		else if (event.keyCode === 40) MoveSelection(0, 1);
	}

	return (
		<div onKeyUp={handleKeyPress}>
			<div style={{display: "inline", position: "absolute", bottom: "2em", right: "3em", zIndex: 1}}>
				<img src="https://i.ibb.co/wzsHBym/add-button.png" onClick={() => { IncremenentPageCount(); 
				if (drawingStyle === "selection") {
					setDrawingStyle("panning"); 
				 } }} 
				style={{width: "100%", cursor: "pointer"}}></img>
			</div>

			<div className="dashed-border" style={{zIndex: 1}}>
			</div>
			
			<div className="clickthrough_container" style={{display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#FBFBFB", padding: "5px", boxShadow: "inset 0px 27px 18px -30px rgba(163,163,163,0.62)"}}>
				<IconButton style={{color: "#373936"}} onClick={() => { Undo(); }}> <UndoIcon/> </IconButton>
				<IconButton style={{color: "#373936"}} onClick={() => { Redo(); }}> <RedoIcon/> </IconButton>

				<Box mx={3}></Box>

				<IconButton style={{color: "#373936", backgroundColor: "#E8E8E8"}} onClick={() => { setDrawingStyle('freeform'); }} ref={freeformIconRef}> <CreateIcon/> </IconButton>
				<IconButton style={{color: "#373936"}} onClick={() => { setDrawingStyle('eraser'); }} ref={eraserIconRef}> <ClearAllIcon/> </IconButton>
				<IconButton style={{color: "#373936"}} onClick={() => { setDrawingStyle('panning'); }} ref={panningIconRef}> <OpenWithIcon/> </IconButton>
				<IconButton style={{color: "#373936"}} onClick={() => { setDrawingStyle('selection'); }} ref={selectionIconRef}> <PhotoSizeSelectLargeIcon/> </IconButton>

				<Box mx={3}></Box>
				
				<ComboBox defaultIndex={0} editable={false} style={{width: 42, height: 42, position: "relative"}} inputStyles={{display: "hidden"}} highlightColor="#DFDFDF" selectedOptionColor="#FFFFFF"
					options={brushSizeOptions}
					onSelect={(option) => { setBrushThickness(option); 
						brushComboBoxRef.current.innerHTML = option;
					}
				}>
				</ComboBox>
				<p className="clickthrough" ref={brushComboBoxRef} style={{position: "absolute", marginLeft: "12.0em", padding: "0.4em", backgroundColor: "#FBFBFB", zOrder: 2}}> 3 </p>

				<IconButton style={{color: "#373936"}} onClick={() => { colorPickerRef.current.style.display = "inline"; }}> <FormatColorTextIcon/> </IconButton>

				<Box mx={3}></Box>

				<IconButton style={{color: "#17C69A"}}> <ShareIcon/> </IconButton>
				<IconButton style={{color: "#17C69A"}}> <HomeIcon/> </IconButton>
			</div>

			<div style={{backgroundColor: "#FBFBFB", boxShadow: "inset 0px 27px 18px -30px rgba(163,163,163,0.62)", padding: "1px", position:"relative"}}>
				<div ref={colorPickerRef} style={{display: "none", position: "absolute", marginLeft: "40%", marginTop: "2em", zIndex: 1}}>
					<SwatchesPicker width={300} height={150} color={brushColor} onChange={(event) => {
						setBrushColor(event.hex);
						colorPickerRef.current.style.display = "none";
					}}/>
				</div>

				<TransformWrapper 
				ref={zoomPanPitchRef} 
				{... {
					panning: {...{disabled: bPanning}}, 
					limitToBounds: false,
					minScale: 0.1,
					initialScale: zoomScale,
					onZoom: (ref, event) => { setZoomScale(ref.state.scale); } 
				}}>
					<TransformComponent>
						{ MultiPageCanvas(brushThickness, brushColor, bEraseCanvas, bDisableCanvas, zoomScale, bSelect) }
					</TransformComponent>
				</TransformWrapper>
			</div>
		</div>        
	)
};

export { CanvasEditor };