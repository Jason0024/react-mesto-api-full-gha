import React from 'react';
import PopupWithForm from './PopupWithForm';

function PopupAddCard({ isOpen, onClose, onAddPlace }) {

  const [name, setName] = React.useState('');
  const [link, setLink] = React.useState('');

  const handleNameChange = (evt) => {
    setName(evt.target.value);
  }

  const handleLinkChange = (evt) => {
    setLink(evt.target.value);
  }

  const handleAddPlaceSubmit = (evt) => {
    evt.preventDefault();
    onAddPlace({ name, link });
  }

  React.useEffect(() => {
    if (!isOpen) {
      setName('');
      setLink('');
    }
  }, [isOpen])

  return (
    < PopupWithForm
      title='Новое место'
      name="new-location"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleAddPlaceSubmit}
      buttonText='Создать' >

      <label className="popup__field">
        <input
          id="place-name-input"
          type="text"
          className="popup__input"
          name="placename"
          placeholder="Название"
          value={name}
          minLength="2"
          maxLength="30"
          onChange={handleNameChange}
          required />
        <span className="place-name-input-error popup__input-error" />
      </label>
      <label className="popup__field">
        <input
          id="place-image-input"
          type="url"
          className="popup__input"
          name="placeimage"
          required
          value={link}
          onChange={handleLinkChange}
          placeholder="Ссылка на картинку" />
        <span className="place-image-input-error popup__input-error"></span>
      </label>
    </PopupWithForm>
  )
}

export default PopupAddCard;