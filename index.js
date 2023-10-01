const express = require('express');
require('dotenv').config();

const TelegramBot = require('node-telegram-bot-api');
const { onCallbackQuery } = require('./utils');

const app = express();

const token = process.env.TELEGRAM_TOKEN;
const nse_bot = new TelegramBot(token, { polling: true });
nse_bot.on('polling_error', (msg) => console.log(msg));

//telegram bot
let inline_keyboard = [
  [
    {
      text: 'Get all stocks',
      callback_data: 'Get all stocks',
    },
    {
      text: 'Get a particular stock price',
      callback_data: 'Get a particular stock price',
    },
  ],
  [
    {
      text: 'Exit',
      callback_data: 'Exit',
    },
  ],
];

// handle start command
nse_bot.onText(/\/start/, (msg) => {
  nse_bot.sendMessage(
    msg.chat.id,
    `Welcome to the NSE bot ${msg.from.first_name}`,
    {
      reply_markup: {
        inline_keyboard,
      },
    }
  );
});

//handle keyboard prompts
nse_bot.on('callback_query', onCallbackQuery);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));

// export to utils - cant use module.exports dut to circular dependency error
exports.nse_bot = nse_bot;
