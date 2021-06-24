require('dotenv').config();

const db = require('quick.db');
const { Client, Intents } = require('discord.js');
const { Handler } = require('discord-handling');

var handler = new Handler({
    indexPath: __dirname,
    token: process.env.token,
    prefix: require('../config.json').prefix
});
handler.createCommandCollection()
.createEventCollection()
.handleEvents()

handler.getClient().sendError = (msg, content) => {
    return msg.reply(`🧐 - **${content}**`);
};