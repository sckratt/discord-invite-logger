const { Client, Message, MessageEmbed } = require('discord.js');
const db = require('quick.db');
const colors = require('hexacolors');

/**
 * @param {Client} client 
 * @param {Message} msg 
 * @param {Array<string>} args 
 */
const run = async (client, msg, args) => {
    const message = args.join(" ");
    if(!message) return client.sendError("Vous devez fournir un message qui sera envoyé lorsqu'un membre rejoindra le serveur.", msg);
    db.set(`guilds.${msg.guild.id}.welcomeMessage`, message);
    client.sendDone(`Le message d'arrivée à bien été modifié.`, msg);
};

let variables = [
    "{inviterMention}", "{inviterTag}", "{inviterUsername}", "{inviterID}", "{inviteCount}",
    "{memberMention}", "{memberTag}", "{memberUsername}", "{memberID}", "{memberCreatedAt}"
];
module.exports = {
    name: "welcomeMessage",
    category: "config",
    description: `Permet de configurer le messages de bienvenue.\n__**Les variable disponibles :**__\n${variables.map(v => `\`\`${v}\`\``).join(", ")}`,
    usage: "``[#channel | channelID]``",
    aliases: ["msg"],
    permissions: ["MANAGE_CHANNELS"],
    run: run
};