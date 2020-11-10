const { Client, Message, MessageEmbed } = require('discord.js');
const db = require('quick.db');
const colors = require('hexacolors');

/**
 * @param {Client} client 
 * @param {Message} msg 
 * @param {Array<string>} args 
 */
const run = async (client, msg, args) => {
    const guild = db.get(`guilds.${msg.guild.id}`);
    const channel = msg.mentions.channels.first() || msg.guild.channels.cache.get(args[0]) || msg.guild.channels.cache.find(c => c.name.includes(args.join(" ")));
    if(!channel || channel.type !== "text") return client.sendError("Aucun salon textuel ne correspond aux informations données.", msg);
    db.set(`guilds.${msg.guild.id}.welcomeChannelID`, channel.id);
    client.sendDone(`Les messages d'invitations seront envoyés dans le salon ${channel.toString()}.`, msg);
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