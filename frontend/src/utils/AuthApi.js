class AuthApi {
  constructor(apiAddress) {
    this._authUrl = apiAddress;
  }
  // Метод обработки ответа сервера
  _parseResponse (res) {
    if (res.ok) {
      return res.json();
    } else {
      return Promise.reject(`код ошибки: ${res.status}`);
    }
  }
  
  // Метод верификации токена
  verifyToken (token) {
    return fetch(`${this._authUrl}users/me`, {
      // По умолчанию fetch — это GET, можно не указывать
      headers: {
        "Content-Type": "application/json",
        Authorization : `Bearer ${token}`
      }
    })
      .then(this._parseResponse)
  }
  // Метод авторизации пользователя
  userAuthorization (password, email) {
    return fetch(`${this._authUrl}signin`, {
      mode: 'no-cors',
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password, email })
    })
      .then(this._parseResponse)
      .then((userData) => {
        if (userData.token) { localStorage.setItem('token', userData.token) }
      })
  }
  // Метод регистрации пользователя
  userRegistration (password, email) {
    return fetch(`${this._authUrl}signup`, {
      mode: 'no-cors',
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password, email })
    })
      .then(this._parseResponse)
  }
}

// Создание экземпляра класса
const apiAuth = new AuthApi('https://api.jason.student.nomoredomains.rocks/');
// Экспорт экземпляра класса
export default apiAuth;