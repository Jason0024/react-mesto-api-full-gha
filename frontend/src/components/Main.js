import React from 'react';
import Card from './Card';
import {CurrentUserContext} from '../context/CurrentUserContext';

function Main({ cards, onEditProfile, onEditAvatar, onNewLocation, onCardClick, onCardLike, onCardDelete}) {

    // Подписка на контекст
    const userItem = React.useContext(CurrentUserContext);

    return (
        <main>
            <section className="profile">
                <img src={userItem.avatar} className="profile__avatar" alt="Аватар профиля" />
                <button type="button" className="profile__avatar-btn" aria-label="Редактировать аватар профиля" onClick={onEditAvatar} />
                <div className="profile__info">
                    <h1 className="profile__name">{userItem.name}</h1>
                    <p className="profile__job">{userItem.about}</p>
                    <button type="button" className="profile__edit" aria-label="Редактировать профиль" onClick={onEditProfile} />
                </div>
                <button className="profile__add-button" type="button" aria-label="Добавить место" onClick={onNewLocation} />
            </section>
            <section className="elements">
                {cards.map((card) => (
                    < Card
                        key={card._id}
                        card={card}
                        onCardClick={onCardClick}
                        onCardLike={onCardLike}
                        onCardDelete={onCardDelete} />
                ))}
            </section>
        </main>
    )
}

export default Main;
