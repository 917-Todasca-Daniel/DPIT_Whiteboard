import React, { useRef, useState } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { SwatchesPicker  } from 'react-color';
import ComboBox from 'react-responsive-combo-box'

import 'react-responsive-combo-box/dist/index.css'

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

import CanvasDraw from "./CanvasDraw";

import './clickthrough.css'

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
	['eraser', 80], ['freeform', 3]
])
var brushSizeOptions = [3, 6, 20, 80];

const CanvasEditor = () => {
	const [bEraseCanvas, 	setErase] 		= useState(false);
	const [bDisableCanvas, 	disableCanvas] 	= useState(false);
	const [bPanning, 		setPanning] 	= useState(true);

	const [brushColor, 		setBrushColor] 		= useState("#000000");
	const [brushThickness, 	setBrushThickness] 	= useState(3);
	const [zoomScale, 		setZoomScale] 		= useState(1);

	const canvasRef 		= useRef(null);
	const zoomPanPitchRef 	= useRef(null);
	const brushComboBoxRef 	= useRef(null);
	const eraserIconRef 	= useRef(null);
	const freeformIconRef 	= useRef(null);
	const panningIconRef 	= useRef(null);
	const colorPickerRef 	= useRef(null);

	const drawingStylesBehaviours = new Map([
		['eraser', 		() => { setErase(true); 	setPanning(true); 	disableCanvas(false); 	}],
		['freeform', 	() => { setErase(false); 	setPanning(true); 	disableCanvas(false); 	}],
		['panning',		() => { setErase(false); 	setPanning(false); 	disableCanvas(true); 	}],
	])

	const iconRefMap = new Map([
		['eraser', 		eraserIconRef],
		['freeform', 	freeformIconRef],
		['panning',		panningIconRef],
	])

	const setDrawingStyle = (newDrawingStyle) => {
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
		if (canvasRef.current) {
			if (event.ctrlKey) {
				console.log(event.keyCode);
				if (event.keyCode === 90) canvasRef.current.undo();
				else if (event.keyCode === 89) canvasRef.current.redo();
			}
		}
	}

	return (
		<div onKeyUp={handleKeyPress}>
			<div className="clickthrough_container" style={{display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#FBFBFB", padding: "5px", boxShadow: "inset 0px 27px 18px -30px rgba(163,163,163,0.62)"}}>
				<IconButton style={{color: "#373936"}} onClick={() => { canvasRef.current.undo(); }}> <UndoIcon/> </IconButton>
				<IconButton style={{color: "#373936"}} onClick={() => { canvasRef.current.redo(); }}> <RedoIcon/> </IconButton>

				<Box mx={3}></Box>

				<IconButton style={{color: "#373936", backgroundColor: "#E8E8E8"}} onClick={() => { setDrawingStyle('freeform'); }} ref={freeformIconRef}> <CreateIcon/> </IconButton>
				<IconButton style={{color: "#373936"}} onClick={() => { setDrawingStyle('eraser'); }} ref={eraserIconRef}> <ClearAllIcon/> </IconButton>
				<IconButton style={{color: "#373936"}} onClick={() => { setDrawingStyle('panning'); }} ref={panningIconRef}> <OpenWithIcon/> </IconButton>

				<Box mx={3}></Box>
				
				<ComboBox defaultIndex={0} editable={false} style={{width: 42, height: 42, position: "relative"}} inputStyles={{display: "hidden"}} highlightColor="#DFDFDF" selectedOptionColor="#17C69A"
					options={brushSizeOptions}
					onSelect={(option) => { setBrushThickness(option); 
						brushComboBoxRef.current.innerHTML = option;
					}
				}>
				</ComboBox>
				<p className="clickthrough" ref={brushComboBoxRef} style={{position: "absolute", marginLeft: "8.7em", padding: "0.4em", backgroundColor: "#FBFBFB", zOrder: 2}}> 3 </p>

				<IconButton style={{color: "#373936"}} onClick={() => { colorPickerRef.current.style.display = "inline"; }}> <FormatColorTextIcon/> </IconButton>

				<Box mx={3}></Box>

				<IconButton style={{color: "#17C69A"}}> <ShareIcon/> </IconButton>
				<IconButton style={{color: "#17C69A"}}> <HomeIcon/> </IconButton>
			</div>

			<div style={{backgroundColor: "#FBFBFB", boxShadow: "inset 0px 27px 18px -30px rgba(163,163,163,0.62)", position:"relative"}}>
				<div ref={colorPickerRef} style={{display: "none", position: "absolute", marginLeft: "40%", marginTop: "2em", zIndex: 1}}>
					<SwatchesPicker width={300} height={150} color={brushColor} onChange={(event) => {
						setBrushColor(event.hex);
						colorPickerRef.current.style.display = "none";
					}}/>
				</div>

				<TransformWrapper
				{... {
					panning: {...{disabled: bPanning}}, 
					ref: zoomPanPitchRef, 
					limitToBounds: false,
					minScale: 0.1,
					initialScale: zoomScale,
					onZoom: (ref, event) => { setZoomScale(ref.state.scale); } 
				}}>
					<TransformComponent>
						<CanvasDraw 
						style		={{boxShadow: "0px 10px 35px 1px #969696"}}
						ref			={canvasRef}
						lazyRadius	={0}
						canvasWidth	={2480} 
						canvasHeight={3508}
						brushRadius	={brushThickness}
						brushColor	={brushColor}
						eraseCanvas	={bEraseCanvas}
						disabled	={bDisableCanvas}
						scale		={zoomScale}
						hideGrid	={true}
						imgSrc		={"https://i.ibb.co/72zYhbb/edited.jpg"}
						/>
					</TransformComponent>
				</TransformWrapper>
			</div>
		</div>        
	)
};

export { CanvasEditor };