import React from 'react';

function ImagePopup({card, onClose}){ 
  return(
    <div className={`popup popup popup_type_modal ${card? 'popup_open':''}`}>
      <div className="popup__container">
        <button className="popup__close" type="button" onClick={onClose} aria-label="Закрыть" />
        <img className="popup__pic" src={card?.link} alt={`Фотография места ${card?.name}`} />
        <h3 className="popup__caption">{card?.name}</h3>
      </div>
    </div>
  );  
}

export default ImagePopup;