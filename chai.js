/** @format */

const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");

// Replace with your bot's token
const botToken = process.env.TELEGRAM_BOT_TOKEN;

// Create a bot instance
const bot = new TelegramBot(botToken, { polling: true });

// Blockchain.info API endpoint for fetching Bitcoin address data
const getAddressDetails = (bitcoinAddress) => {
  return axios.get(`https://blockchain.info/rawaddr/${bitcoinAddress}`);
};

// Send a response when a user sends a Bitcoin address to the bot
bot.onText(/\/gettx (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const bitcoinAddress = match[1]; // Extract Bitcoin address from the message

  try {
    // Fetch transaction details using the address
    const response = await getAddressDetails(bitcoinAddress);
    const data = response.data;

    // Prepare the result to send back to the user
    const result = `
      Address: ${data.address}
      Total Received: ${data.total_received / 100000000} BTC
      Total Sent: ${data.total_sent / 100000000} BTC
      Final Balance: ${data.final_balance / 100000000} BTC
    `;

    // Send the result to the user on Telegram
    bot.sendMessage(chatId, result);
  } catch (error) {
    console.error("Error fetching address details:", error);
    bot.sendMessage(chatId, "Error fetching details. Please try again.");
  }
});

// Log when the bot is ready
console.log("Bot is up and running!");
