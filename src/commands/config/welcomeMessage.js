const { Client, Message, MessageEmbed } = require('discord.js');
const db = require('quick.db');
const colors = require('hexacolors');

/**
 * @param {Client} client 
 * @param {Message} msg 
 * @param {Array<string>} args 
 */
const run = async (client, msg, args) => {
    if(!msg.member.hasPermission("MANAGE_GUILD")) return client.sendError("Vous n'avez pas la permission d'utiliser cette commande.", msg);
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
    name: "config welcomeMessage",
    category: "config",
    description: `Permet de configurer le messages de bienvenue.\n__**Les variable disponibles :**__\n${variables.map(v => `\`\`${v}\`\``).join(", ")}`,
    usage: "``<message>``",
    aliases: ["welcomeMessage", "msg"],
    permissions: ["MANAGE_GUILD"],
    run: run
};