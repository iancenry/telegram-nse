const express = require('express');
require('dotenv').config();

const { errorHandler } = require('./middleware/errors');
const cors = require('cors');
const TelegramBot = require('node-telegram-bot-api');

const app = express();

const nse_bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });
nse_bot.on('polling_error', (msg) => console.log('polling error'));

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//telegram bot
nse_bot.on('message', (msg) => {
  let Hi = 'hi';
  if (msg.text.toString().toLowerCase().indexOf(Hi) === 0) {
    bot.sendMessage(msg.chat.id, 'Hello dear user');
  }
});

// nse_bot.onText('/start', (msg) => {
//   const {
//     chat: { id },
//   } = msg;

//   nse_bot.sendMessage(id, `Welcome to the NSE bot`, {
//     reply_markup: {
//       inline_keyboard,
//     },
//   });
// });

// nse_bot.onText('message', (msg) => {
//   const {
//     chat: { id },
//   } = msg;

//   nse_bot.sendMessage(id, `Welcome to the NSE bot`, {
//     reply_markup: {
//       inline_keyboard,
//     },
//   });
// });

// nse_bot.onText('Get all stocks', (msg) => {
//   nse_bot.sendMessage(msg.chat.id, 'Fetch all');
// });

// nse_bot.onText('Get a particular stock price', (msg) => {
//   nse_bot
//     .sendMessage(msg.chat.id, 'Kindly send the name of the stock')
//     .then((message) => {
//       nse_bot.onReplyToMessage(message.chat.id, message.message_id, (msg) => {
//         const received_message = msg.text;
//         nse_bot.sendMessage(`Here is the price for ${received_message}`);
//       });
//     });
// });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
