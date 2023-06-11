import React, { useEffect, useState } from 'react';

import { Route, Switch, useHistory } from 'react-router-dom';

import Header from './Header';
import Main from './Main';
import Footer from './Footer';

import ImagePopup from './ImagePopup';
import PopupEditAvatar from './PopupEditAvatar';
import PopupEditProfile from './PopupEditProfile';
import PopupAddCard from './PopupAddCard';

import ProtectedRoute from './ProtectedRoute';
import Register from './Register';
import Login from './Login';

import { CurrentUserContext } from '../context/CurrentUserContext';
import apiConnect from '../utils/Api';
import apiAuth from '../utils/AuthApi';
import InfoTooltip from "./InfoTooltip";



function App() {
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [cards, setCards] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const [email, setEmail] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [status, setStatus] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const history = useHistory();
  // Рендер карточек и данных пользователя
  useEffect( () => {
    const token = localStorage.getItem('token');
    if (token) { Promise.all([ apiConnect.getUserData(), apiConnect.getInitialCards() ])
      .then(( [ userItem, initialCards] ) => {
        setCurrentUser(userItem);
        setCards(initialCards);
      })
      .catch( (err) => { console.log(`Возникла глобальная ошибка, ${err}`) })
    }
  }, [isLoggedIn])

  // Верификация токена пользователя
  useEffect( () => {
    const token = localStorage.getItem('token');
    if (token) { apiAuth.tokenVerification(token)
        .then( (res) => { setIsLoggedIn(true); setEmail(res.email); history.push('/') })
        .catch( (err) => { localStorage.removeItem('token'); console.log(`Возникла ошибка верификации токена, ${err}`) })
    }
  }, [history, isLoggedIn])
  // Обработчик открытия попапа обновления аватара
  const handleEditAvatarClick = () => {
    setIsEditAvatarPopupOpen(true)
  }
  // Обработчик открытия попапа редактирования профиля
  const handleEditProfileClick = () => {
    setIsEditProfilePopupOpen(true);
  }
  // Обработчик открытия попапа добавления карточки
  const handleAddPlaceClick = () => {
    setIsAddPlacePopupOpen(true);
  }
  // Обработчик для увеличения изображения и передачи данных
  const handleCardClick = (cardItem) => {
    setIsImageOpen(true);
    setSelectedCard({
      ...selectedCard,
      name: cardItem.name,
      link: cardItem.link
    })
  }
  // Функция для закрытия всех попапов
  const closeAllPopups = () => {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsImageOpen(false);
    setTooltipOpen(false);
  }
  // Обработчик данных пользователя
  const handleUpdateUser = (userItem) => {
    apiConnect.sendUserData(userItem.name, userItem.about)
      .then((res) => { setCurrentUser(res); closeAllPopups() })
      .catch((err) => { console.log(`Возникла ошибка при редактировании профиля, ${err}`) })
  }
  // Обработчик изменения аватара
  const handleUpdateAvatar = (link) => {
    apiConnect.sendAvatarData(link)
      .then((res) => { setCurrentUser(res); closeAllPopups() })
      .catch((err) => { console.log(`Возникла ошибка при зименении аватара, ${err}`) })
  }
  // Обработчик лайков карточки
  const handleCardLike = (card) => {
    const isLiked = card.likes.some( (like) => like === currentUser._id );
    apiConnect.changeLikeCardStatus(card._id, !isLiked)
    .then( (cardItem) => {
      setCards( (listCards) => listCards.map( (item) => (item._id === card._id ? cardItem : item) ) );
    })
      .catch(err => {
        console.log(err.status);
        alert(`Ошибка загрузки данных карточки:\n ${err.status}\n ${err.text}`);
      });
  }
  // Обработчик добавления карточки
  const handleAddCard = (cardItem) => {
    apiConnect.addNewCard(cardItem.name, cardItem.link)
      .then((card) => { setCards([card, ...cards]); closeAllPopups() })
      .catch((err) => { console.log(`Возникла ошибка при добавлении новой карточки, ${err}`) })
  }
  // Обработчик удаления карточки
  const handleCardDelete = (card) => {
    apiConnect.deleteCard(card._id)
    .then( () => { setCards( (listCards) => listCards.filter((cardItem) => cardItem._id !== card._id) ); })
    .catch((err) => { console.log(`Возникла ошибка при удалении карточки, ${err}`) })
      .then(() => { setCards((cardsArray) => cardsArray.filter((cardItem) => cardItem._id !== card._id)) })
      .catch((err) => { console.log(`Возникла ошибка при удалении карточки, ${err}`) })
  }
  // Функция регистрации пользователя (при успехе(и нет) всплывает popup через Tooltip используя статус)
  function handleRegister(password, email) {
    apiAuth.userRegistration(password, email)
      .then(() => { setTooltipOpen(true); setStatus(true) })
      .catch((err) => { console.log(`Возникла ошибка при регистрации пользователя, ${err}`); setTooltipOpen(true); setStatus(false) })
  }
  // Функция авторизации пользователя (при неудаче всплывает popup через Tooltip используя статус)
  function handleLogin(password, email) {
    apiAuth.userAuthorization(password, email)
    .then( () => {
      // Если токен валиден, авторизовываем и перебрасываем на главную
      const token = localStorage.getItem('token');
      if (token) { setIsLoggedIn(true); setEmail(email); history.push('/') }
    })
      .catch((err) => { console.log(`Возникла ошибка при авторизации, ${err}`); setTooltipOpen(true); setStatus(false) })
  }

  function handleLogout() { localStorage.removeItem('token'); setIsLoggedIn(false); }

  return (
    <CurrentUserContext.Provider value={currentUser} >
      <div className="page">
        <Header
          isLoggedIn={isLoggedIn}
          email={email}
          isLogout={handleLogout} />
        <Switch>
          <ProtectedRoute exact path='/'
            isLoggedIn={isLoggedIn}
            component={Main}
            onEditAvatar={handleEditAvatarClick}
            onEditProfile={handleEditProfileClick}
            onNewLocation={handleAddPlaceClick}
            onCardClick={handleCardClick}
            onCardDelete={handleCardDelete}
            onCardLike={handleCardLike}
            cards={cards} />
          <Route path={`/sign-in`}>
            <Login
              handleLogin={handleLogin}
              isOpen={tooltipOpen}
              onClose={closeAllPopups}
              status={status} />
          </Route>
          <Route path={`/sign-up`}>
            <Register
              handleRegister={handleRegister}
              isOpen={tooltipOpen}
              onClose={closeAllPopups}
              status={status} />
          </Route>
        </Switch>
        <Footer />
        <PopupEditAvatar
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar} />
        <PopupEditProfile
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser} />
        <PopupAddCard
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddCard} />
        <ImagePopup
          isOpen={isImageOpen}
          onClose={closeAllPopups}
          card={selectedCard} />
        <InfoTooltip
          isOpen={tooltipOpen}
          onClose={closeAllPopups}
          status={status} />
      </div>
    </CurrentUserContext.Provider >
  );
}

export default App;
