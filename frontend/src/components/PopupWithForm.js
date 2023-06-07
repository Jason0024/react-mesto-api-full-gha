import React from 'react';

function PopupWithForm({isOpen, onClose, name, title, buttonText, children, onSubmit, id}) {
    return (
      <div className={ `popup ${ isOpen ? 'popup_open' : '' }` } id={ id }>
        
        <div className="popup__container">
          <button type="button" className="popup__close" onClick={ onClose } aria-label="Закрыть форму" />          
          <form className="popup__form" name={ name } onSubmit={ onSubmit }>
          <h2 className="popup__title">{ title }</h2>
            { children }
            <button type="submit" className="popup__submit" aria-label="Сохранить">{ buttonText || 'Сохранить' }</button>
          </form>
        </div>
      </div>
    )
  }
  
  export default PopupWithForm;