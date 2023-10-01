const express = require('express');
require('dotenv').config();

const TelegramBot = require('node-telegram-bot-api');

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
nse_bot.on('callback_query', function onCallbackQuery(callbackQuery) {
  if (callbackQuery.data === `Get all stocks`) {
    nse_bot
      .sendMessage(callbackQuery.message.chat.id, 'Here are all stocks')
      .catch((err) => console.log(err.message));
  } else if (callbackQuery.data === `Get a particular stock price`) {
    nse_bot
      .sendMessage(
        callbackQuery.message.chat.id,
        'Kindly send the name of the stock',
        {
          reply_markup: {
            force_reply: true,
          },
        }
      )
      .then((message) => {
        const replyListenerId = nse_bot.onReplyToMessage(
          message.chat.id,
          message.message_id,
          (message) => {
            // prevent consecutive replys
            nse_bot.removeReplyListener(replyListenerId);
            const received_message = message.text;
            nse_bot.sendMessage(
              message.chat.id,
              `Here is the price for ${received_message}`
            );
          }
        );
      })
      .catch((err) => console.log(err.message));
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
