import React from 'react';

function PopupWithForm(props) {
    return (
      <div className={ `popup ${ props.isOpen ? 'popup_open' : '' }` } id={ props.id }>
        
        <div className="popup__container">
          <button type="button" className="popup__close" onClick={ props.onClose } aria-label="Закрыть форму" />          
          <form className="popup__form" name={ props.name } onSubmit={ props.onSubmit }>
          <h2 className="popup__title">{ props.title }</h2>
            { props.children }
            <button type="submit" className="popup__submit" aria-label="Сохранить">{ props.buttonText || 'Сохранить' }</button>
          </form>
        </div>
      </div>
    )
  }
  
  export default PopupWithForm;