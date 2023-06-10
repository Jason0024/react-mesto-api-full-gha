import React, { useEffect, useState } from 'react';

import { Route, Switch, useHistory } from 'react-router-dom';

import Header from './Header';
import Main from './Main';
import Footer from './Footer';

import PopupEditAvatar from './PopupEditAvatar';
import PopupEditProfile from './PopupEditProfile';
import PopupAddCard from './PopupAddCard';
import ImagePopup from './ImagePopup';

import ProtectedRoute from './ProtectedRoute';
import Register from './Register';
import Login from './Login';
import InfoTooltip from "./InfoTooltip";

import { CurrentUserContext } from '../context/CurrentUserContext';
import apiConnect from '../utils/Api';
import apiAuth from '../utils/AuthApi';



function App() {
  const [currentUser, setCurrentUser] = useState({
    "name": '',
    "about": '',
    "avatar": '',
    "_id": '',
    "cohort": ''
  });
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [cards, setCards] = useState([]);

  const [email, setEmail] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [status, setStatus] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const history = useHistory();

  useEffect(() => {
    Promise.all([apiConnect.getUserData(), apiConnect.getInitialCards()])
      .then((values) => {
        setCurrentUser(values[0]);
        setCards([...values[1]]);
      })
      .catch((err) => { console.log(`Возникла глобальная ошибка, ${err}`) })
  }, [])

  useEffect(() => {
    const userToken = localStorage.getItem('token')
    if (userToken) {
      apiAuth.verifyToken(userToken)
        .then((res) => { setEmail(res.data.email); setIsLoggedIn(true); history.push('/') })
        .catch((err) => { console.log(`Возникла ошибка верификации токена, ${err}`) })
    }
  }, [history, isLoggedIn])

  const handleEditProfileClick = () => {
    setIsEditProfilePopupOpen(true);
  }

  const handleEditAvatarClick = () => {
    setIsEditAvatarPopupOpen(true)
  }

  const handleAddPlaceClick = () => {
    setIsAddPlacePopupOpen(true);
  }

  const handleCardClick = (cardItem) => {
    setIsImageOpen(true);
    setSelectedCard({
      ...selectedCard,
      name: cardItem.name,
      link: cardItem.link
    })
  }

  const closeAllPopups = () => {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsImageOpen(false);
    setTooltipOpen(false);
  }

  const handleUpdateUser = (userItem) => {
    apiConnect.sendUserData(userItem.name, userItem.about)
      .then((res) => { setCurrentUser(res); closeAllPopups() })
      .catch((err) => { console.log(`Возникла ошибка при редактировании профиля, ${err}`) })
  }

  const handleUpdateAvatar = (link) => {
    apiConnect.sendAvatarData(link)
      .then((res) => { setCurrentUser(res); closeAllPopups() })
      .catch((err) => { console.log(`Возникла ошибка при зименении аватара, ${err}`) })
  }


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

  const handleAddCard = (cardItem) => {
    apiConnect.addNewCard(cardItem.name, cardItem.link)
      .then((card) => { setCards([card, ...cards]); closeAllPopups() })
      .catch((err) => { console.log(`Возникла ошибка при добавлении новой карточки, ${err}`) })
  }

  const handleCardDelete = (card) => {
    apiConnect.deleteCard(card._id)
      .then(() => { setCards((cardsArray) => cardsArray.filter((cardItem) => cardItem._id !== card._id)) })
      .catch((err) => { console.log(`Возникла ошибка при удалении карточки, ${err}`) })
  }


  function handleRegister(password, email) {
    apiAuth.userRegistration(password, email)
      .then(() => { setTooltipOpen(true); setStatus(true) })
      .catch((err) => { console.log(`Возникла ошибка при регистрации пользователя, ${err}`); setTooltipOpen(true); setStatus(false) })
  }

  function handleLogin(password, email) {
    apiAuth.userAuthorization(password, email)
      .then((res) => {
        if (res.token) {
          localStorage.setItem('token', res.token);
          setEmail(email);
          setIsLoggedIn(true);
          history.push('/');
        }
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
