import React from 'react'
import './Card.css'

export const Card = (
   { id, title, date, isFavorite, image }
) => {

        return (
            <>
            <div className='card-container'> 
                <div className='image-container'>
                    <img style={{maxWidth: '100%'}} src={`${image}`} alt="" />
                </div>
                <p className='card-text title'>{title}</p>
                <p className='card-text date'>created on: {date}</p> 
            </div>
            </>
        )
}
