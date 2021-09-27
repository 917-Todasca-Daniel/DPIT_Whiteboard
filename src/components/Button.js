import React from 'react';
import './Button.css';

const STYLES = ['home_btn--primary', 'home_btn--outline-dark', 'home_btn--outline-light']

const SIZES = ['home_btn--medium', 'home_btn--large', 'home_btn--mobile', 'home_btn--wide']

const COLOR = ['primary', 'blue', 'red', 'green']

export const Button = ({
    children, 
    type, 
    onClick, 
    buttonStyle, 
    buttonSize, 
    buttonColor
}) => {
    const checkButtonStyle = STYLES.includes(buttonStyle) ? 
    buttonStyle : STYLES[0]
    
    const checkButtonSize = SIZES.includes(buttonSize) ? 
    buttonSize : SIZES[0]

    const checkButtonColor = COLOR.includes(buttonColor) ? 
    buttonColor : null

    return (
        <button className={`home_btn ${checkButtonStyle} ${checkButtonSize} ${checkButtonColor}`}
        onClick={onClick} 
        type={type}
        > {children} </button>
    )
}
