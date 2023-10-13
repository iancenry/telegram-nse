const axios = require('axios');
const bot = require('./index');

// TODO finsh - try https://nse-shares.onrender.com/stocks/
const fetchStock = async (stockId) => {
  const options = {
    method: 'GET',
    url: `https://nairobi-stock-exchange-nse.p.rapidapi.com/stocks/${stockId}`,
    headers: {
      'X-RapidAPI-Key': process.env.API_KEY,
      'X-RapidAPI-Host': process.env.API_HOST,
    },
  };

  try {
    const response = await axios.request(options);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error.message);
  }
};

const onCallbackQuery = (callbackQuery) => {
  if (callbackQuery.data === `Get all stocks`) {
    bot.nse_bot
      .sendMessage(callbackQuery.message.chat.id, 'Here are all stocks')
      .catch((err) => console.log(err.message));
  } else if (callbackQuery.data === `Get a particular stock price`) {
    bot.nse_bot
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
        const replyListenerId = bot.nse_bot.onReplyToMessage(
          message.chat.id,
          message.message_id,
          (message) => {
            // prevent consecutive replys
            bot.nse_bot.removeReplyListener(replyListenerId);
            const received_message = message.text;

            const data = fetchStock('saf');

            bot.nse_bot.sendMessage(
              message.chat.id,
              `Here is the price for ${received_message}: ${data}`
            );
          }
        );
      })
      .catch((err) => console.log(err.message));
  } else {
    // TODO - transfer
    bot.nse_bot
      .sendMessage(callbackQuery.message.chat.id, 'See you next time 💸')
      .catch((err) => console.log(err.message));
  }
};

module.exports = { onCallbackQuery };
