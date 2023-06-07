import apiFindings from './apiFindings';

class Api {
    constructor({ link, headers }) {
        this._link = link;
        this._headers = headers;
    }
    // Метод обработки ответа сервера
    _parseResponse(res) {
        if (res.ok) {
            return res.json();
        } else {
            return Promise.reject(`Ошибка: ${res.status}`);
        }
    }

    // Универсальный метод запроса с проверкой ответа
    _request(url, options) {
        return fetch(url, options).then(this._parseResponse)
      }


    // Метод инициализации карточек с сервера
    getInitialCards() {
        return this._request(`${this._link}/cards`, {
            headers: this._headers
        })
    }
    // Метод добавления новой карточки на сервер
    addNewCard(name, link) {
        return this._request(`${this._link}/cards`, {
            method: 'POST',
            headers: this._headers,
            body: JSON.stringify({ name, link })
        })
    }
    // Метод удаления карточки с сервера
    deleteCard(cardId) {
        return this._request(`${this._link}/cards/${cardId}`, {
            method: 'DELETE',
            headers: this._headers
        })
    }
    // Метод получения данных пользователя с сервера
    getUserData() {
        return this._request(`${this._link}/users/me`, {
            headers: this._headers
        })
    }
    // Метод редактирования данных пользователя с отправкой на сервер
    sendUserData(userName, userAbout) {
        return this._request(`${this._link}/users/me`, {
            method: 'PATCH',
            headers: this._headers,
            body: JSON.stringify({ name: userName, about: userAbout })
        })
    }
    // Метод отправки данных о новом аватаре на сервер
    sendAvatarData(avatarLink) {
        return this._request(`${this._link}/users/me/avatar`, {
            method: 'PATCH',
            headers: this._headers,
            body: JSON.stringify({
                avatar: avatarLink.avatar
            })
        })
    }
    // Метод обработки лайков карточки

    setLike(cardId) {
        return this._request(`${this._link}/cards/${cardId}/likes`, {
            method: "PUT",
            headers: this._headers
        })
    }

    deleteLike(cardId) {
        return this._request(`${this._link}/cards/${cardId}/likes`, {
            method: "DELETE",
            headers: this._headers
        })
    }

    changeLikeCardStatus(cardId, isLiked) {
        if (isLiked) {
            return this.setLike(cardId);
        } else {
            return this.deleteLike(cardId);
        }
    }

}

// Создание экземпляра класса
const apiConnect = new Api(apiFindings);

// Экспорт класса
export default apiConnect;