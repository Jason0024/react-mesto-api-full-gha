class Api {
    constructor(apiAddress) {
    this._link = apiAddress;
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
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${ localStorage.getItem('token') }`,
              },
        })
    }
    // Метод добавления новой карточки на сервер
    addNewCard(name, link) {
        return this._request(`${this._link}/cards`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${ localStorage.getItem('token') }`,
              },
            body: JSON.stringify({ name, link })
        })
    }
    // Метод удаления карточки с сервера
    deleteCard(cardId) {
        return this._request(`${this._link}/cards/${cardId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${ localStorage.getItem('token') }`,
              },
        })
    }
    // Метод получения данных пользователя с сервера
    getUserData() {
        return this._request(`${this._link}/users/me`, {
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${ localStorage.getItem('token') }`,
              },
        })
    }
    // Метод редактирования данных пользователя с отправкой на сервер
    sendUserData(userName, userAbout) {
        return this._request(`${this._link}/users/me`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${ localStorage.getItem('token') }`,
              },
            body: JSON.stringify({ name: userName, about: userAbout })
        })
    }
    // Метод отправки данных о новом аватаре на сервер
    sendAvatarData(avatarLink) {
        return this._request(`${this._link}/users/me/avatar`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${ localStorage.getItem('token') }`,
              },
            body: JSON.stringify({
                avatar: avatarLink.avatar
            })
        })
    }
    // Метод обработки лайков карточки
    setLike(cardId) {
        return this._request(`${this._link}/cards/${cardId}/likes`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${ localStorage.getItem('token') }`,
              },
        })
    }

    deleteLike(cardId) {
        return this._request(`${this._link}/cards/${cardId}/likes`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${ localStorage.getItem('token') }`,
              },
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
const apiConnect = new Api('https://api.jason.student.nomoredomains.rocks');

// Экспорт класса
export default apiConnect;