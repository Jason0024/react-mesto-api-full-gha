import React from 'react';
import { CurrentUserContext } from '../context/CurrentUserContext';

function Card({card, onCardClick, onCardLike, onCardDelete}) {
    const handleClick = ()=>{ onCardClick(card); }
    const handleLikeClick = ()=>{ onCardLike(card); }
    const handleDeleteClick = ()=>{ onCardDelete(card); }
    // Подписка на контекст
    const userItem = React.useContext(CurrentUserContext);
    // Определение владения карточкой
    const isOwn = card.owner._id === userItem._id;
    
    // Определение наличие поставленного лайка
    const isLiked = card.likes.some(i => i._id === userItem._id);
    
    return (
            <li className="element-grid__item">
                {isOwn && <button type="button" className='element-grid__delete' onClick={handleDeleteClick} aria-label="Удалить" />}
                <img src={card.link} className="element-grid__pic" onClick={handleClick}  alt={`Фотография места ${card.name}`} />
                <div className="element-grid__item-description">
                    <h2 className="element-grid__title">{card.name}</h2>
                    <div className="element-grid__likes">
                        <button type="button" className={isLiked ? "element-grid__like element-grid__like_active":"element-grid__like"}  onClick={handleLikeClick} aria-label="Like" />
                        <span className="element-grid__likes-number">{card.likes.length}</span>
                    </div>
                </div>
            </li>
    )
    
}

export default Card;