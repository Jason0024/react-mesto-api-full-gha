// eslint-disable-next-line import/no-extraneous-dependencies
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');

const { PORT = 3000 } = process.env;
const cors = require('cors');

// Защита сервера
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { requestLogger, errorLogger } = require('./middlewares/logger');

// Импорт основных роутов
const mainRouter = require('./routes/index');

const app = express();
app.use(cors());

// Для защиты от множества автоматических запросов
// https://www.npmjs.com/package/express-rate-limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

const responseHandler = require('./middlewares/response-handler');

// Блок кода для работы с mongoDB
const mongoDB = 'mongodb://127.0.0.1:27017/mestodb';
mongoose.set('strictQuery', false);
mongoose.connect(mongoDB);

// Автоматически проставлять заголовки безопасности
app.use(express.json());
app.use(limiter);
app.use(helmet());

// Логгер
app.use(requestLogger);
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
