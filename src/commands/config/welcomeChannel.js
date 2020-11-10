const { Client, Message, MessageEmbed } = require('discord.js');
const db = require('quick.db');
const colors = require('hexacolors');

const categoryNames = require('../../../assets/exports/categories.json');

/**
 * @param {Client} client 
 * @param {Message} msg 
 * @param {Array<string>} args 
 */
const run = async (client, msg, args) => {
    const guild = db.get(`guilds.${msg.guild.id}`);
    
};
module.exports = {
    name: "welcomeChannel",
    category: "config",
    description: "Permet de configurer le salon où les messages d'invitations seront envoyés (Si aucun salon n'est précisé, le bot n'enverra pas les messages. Modifiable à tout moment).",
    usage: "``[#channel | channelID]``",
    aliases: ["wlc"],
    permissions: ["MANAGE_CHANNELS"],
    run: run
};