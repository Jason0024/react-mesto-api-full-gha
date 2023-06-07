import { useEffect, useRef } from 'react';
import PopupWithForm from './PopupWithForm';

function PopupEditAvatar(props) {

    // Реф для аватара
    const avatarRef = useRef();
    // Эффект для очистки формы
    useEffect( () => { avatarRef.current.value = '' }, [ props.isOpen ]);
    function handleSubmit(e) {
      e.preventDefault();
      props.onUpdateAvatar({ avatar: avatarRef.current.value });
    }

  return (
    < PopupWithForm
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit = { handleSubmit }
      id='avatar-popup'
      title='Обновить аватар'
      type='avatar'
    >
      <label htmlFor="avatar-input" className="popup__field">
        <input id="avatar" type="url" className="popup__input"
          name="avatar" required placeholder="Введите ссылку на аватар" ref={ avatarRef } minLength="2" maxLength="200" />
        <span id="avatar-error" className="popup__input-error"></span>
      </label>
    </PopupWithForm>
  )
}

export default PopupEditAvatar;