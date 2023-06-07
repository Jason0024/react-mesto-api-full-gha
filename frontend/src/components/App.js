import React, { useEffect, useState } from 'react';

import Header from './Header';
import Main from './Main';
import Footer from './Footer';

import PopupWithForm from './PopupWithForm';
import PopupEditAvatar from './PopupEditAvatar';
import PopupEditProfile from "./PopupEditProfile";
import PopupAddCard from './PopupAddCard';
import ImagePopup from './ImagePopup';

import {CurrentUserContext} from '../context/CurrentUserContext';
import apiConnect from '../utils/Api';



function App() {
  const [currentUser, setCurrentUser] = useState({
    "name":'',
    "about": '',
    "avatar": '',
    "_id": '',
    "cohort": ''
  });
  const [cards, setCards] = useState([]);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  // Рендер карточек и данных пользователя
  useEffect(() => {
    Promise.all([apiConnect.getUserData(), apiConnect.getInitialCards()])
    .then((values)=>{
      setCurrentUser(values[0]);
      setCards([...values[1]]);
      })
      .catch((err) => { console.log(`Возникла глобальная ошибка, ${err}`) })
  }, [])

  const handleEditProfileClick = ()=>{
    setIsEditProfilePopupOpen(true);
  }

  const handleEditAvatarClick = ()=>{
    setIsEditAvatarPopupOpen(true);
  }
  
  
  const handleAddPlaceClick = ()=>{
    setIsAddPlacePopupOpen(true);
  }
  
  const handleCardClick  = (card) =>{
    setSelectedCard(card);
  }

  // Функция для закрытия всех попапов
  const closeAllPopups = ()=>{
    setIsEditProfilePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setSelectedCard(null);
  }

  // Обработчик данных пользователя
  const handleUpdateUser = (userItem) => {
    apiConnect.sendUserData(userItem.name, userItem.about)
      .then((res) => { setCurrentUser(res); closeAllPopups() })
      .catch((err) => { console.log(`Возникла ошибка при редактировании профиля, ${err}`) })
  }

  const handleUpdateAvatar = (link)=> {
    apiConnect.sendAvatarData(link)
      .then((res) => { setCurrentUser(res); closeAllPopups() })
      .catch((err) => { console.log(`Возникла ошибка при зименении аватара, ${err}`) })
  }

  // Обработчик лайков карточки
  const handleCardLike = (card) => {
    const isLiked = card.likes.some(i => i._id === currentUser._id);
    apiConnect.changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
      })
      .catch(err => {
        console.log(err.status);
        alert(`Ошибка загрузки данных карточки:\n ${err.status}\n ${err.text}`);
      });
  }
  
  // Обработчик добавления карточки
  const handleAddPlace = (cardItem)=> {
    apiConnect.addNewCard(cardItem.name, cardItem.link)
      .then((card) => { setCards([card, ...cards]); closeAllPopups() })
      .catch((err) => { console.log(`Возникла ошибка при добавлении новой карточки, ${err}`) })
  }

  const handleCardDelete = (card)=> {
    apiConnect.deleteCard(card._id)
    .then(() => { setCards((cardsArray) => cardsArray.filter((cardItem) => cardItem._id !== card._id)) })
    .catch((err) => { console.log(`Возникла ошибка при удалении карточки, ${err}`) })
  }

  return (
    < CurrentUserContext.Provider value={currentUser} >
      <div className="page">
        <Header />
        <Main 
          cards = {cards}
          onEditProfile = {handleEditProfileClick} 
          onEditAvatar = {handleEditAvatarClick} 
          onNewLocation = {handleAddPlaceClick} 
          onCardClick = {handleCardClick} 
          onCardLike = {handleCardLike} 
          onCardDelete = {handleCardDelete} />
        <Footer />
        < PopupEditAvatar isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar} />
        < PopupEditProfile isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser} />
        < PopupAddCard isOpen = {isAddPlacePopupOpen} onClose = {closeAllPopups} onAddPlace={handleAddPlace} />
        <PopupWithForm 
          title="Вы уверены?" 
          name="delete-location" 
          buttonText = "Да"
        /> 
        <ImagePopup card={selectedCard} onClose={closeAllPopups} />
      </div >
    </CurrentUserContext.Provider>
  );
}

export default App;
