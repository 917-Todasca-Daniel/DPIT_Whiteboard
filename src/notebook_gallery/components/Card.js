import React from 'react'
import { Link } from 'react-router-dom';
import './Card.css'
import FavoriteIcon from '@mui/icons-material/Favorite';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import FavoriteTwoToneIcon from '@mui/icons-material/FavoriteTwoTone';
import RestorePageIcon from '@mui/icons-material/RestorePage';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Backdrop } from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';



export const Card = (
   { id, title, image, date, isFavorite, idState, optionState, selectedOption, isSelected, page }
) => {

    const [myIdState, setMyIdState] = idState;
    const [cardState, setCardState] = optionState;
    const [option, setOption] = selectedOption;
    const [selected, setSelected] = isSelected;

    const handleChange = () => {
        setMyIdState(id);
        setCardState(!cardState);
    }

    const myId = id;
    const favoriteState = isFavorite;
    const idealState = (myIdState === myId && cardState)
        return (
            <>
            <div className={`card-container ${idealState ? "clicked" : "not-clicked"}`} onClick={handleChange}> 
            {
                (
                    page !== 'deleted' ?
                    <>
                    <div className={`option-bar ${idealState ? "clicked" : "not-clicked"}`}>
                        <Link to='/canvas' style={{'textDecoration': 'none',  'color': 'inherit'}}>
                            <section className='option'>
                                <ModeEditIcon className='option-icon' style={{'color' : 'black !important'}}/>
                            </section>
                        </Link>
                        <section className={`option ${favoriteState ? 'isFavorite' : 'isNotFavorite'}`} onClick={() => {setOption('fav'); setSelected(true)}}>
                            <FavoriteTwoToneIcon className={`option-icon ${favoriteState ? 'isFavorite-heart' : 'isNotFavorite-heart'}`}/>
                        </section>
                        <section className='option' onClick={() => {setOption('share'); setSelected(true)}}>
                            <ShareIcon className='option-icon'/>
                        </section>
                        <section className='option' onClick={() => {setOption('delete'); setSelected(true)}}>
                            <DeleteIcon className='option-icon'/>
                        </section>
                    </div>   
                    </> 
                    :
                    <div className={`option-bar-deleted ${idealState ? "clicked" : "not-clicked"}`}>
                        <section className='option deleted' onClick={() => {setOption('restore'); setSelected(true)}}>
                            <RestorePageIcon className='option-icon' />
                        </section>
                        <section className='option deleted' onClick={() => {setOption('remove'); setSelected(true)}}>
                            <DeleteForeverIcon className='option-icon' />
                        </section>
                    </div>
                )
            }
                <div className={`image-container ${idealState ? "clicked" : "not-clicked"}`}>
                    <img style={{maxWidth: '100%'}} src={`${image}`} alt="" />
                </div>
                <div className='cardtext-area'>
                    <p className='card-text title'>{title}</p>
                    <p className='card-text date'>created on: {date}</p> 
                </div>
            </div>
            </>
        )
}
