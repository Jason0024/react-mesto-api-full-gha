// eslint-disable-next-line import/no-extraneous-dependencies
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env; 

// Защита сервера
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { requestLogger, errorLogger } = require('./middlewares/logger');

// Импорт основных роутов
const mainRouter = require('./routes/index');

const app = express();
//CORP alowd sites
const allowedCors = [
  'https://jason.student.nomoredomains.rocks/',
  'http://jason.student.nomoredomains.rocks/',
  'http://localhost:3000',
  'http://localhost:3001',
];
// Для защиты от множества автоматических запросов
// https://www.npmjs.com/package/express-rate-limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

const responseHandler = require('./middlewares/response-handler');

// Блок кода для работы с mongoDB
mongoose.set('strictQuery', false);
mongoose.connect(DB_URL);
// Автоматически проставлять заголовки безопасности
app.use(express.json());
app.use(helmet());
// Логгер
app.use(requestLogger);
// Лимитер
app.use(limiter);
//CORP config
app.use((req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  const requestHeaders = req.headers['access-control-request-headers'];
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', true);
  }
  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }
  return next();
});
// Краш-тест
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
// Основные рабочие роуты
app.use(mainRouter);
app.use(errorLogger);
// Обработчик ответов
app.use(errors());
app.use(responseHandler);

// Служебная информация: адрес запущенного сервера
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log('Сервер успешно запущен');
});
