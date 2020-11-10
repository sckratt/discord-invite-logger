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
    const prefix = args[0]
    if(!prefix) return client.sendError("Vous devez donner la nouvelle valeur du préfix !", msg);

    db.set(`guilds.${msg.guild.id}.prefix`, prefix);
    client.sendDone(`Le nouveau préfix est maintenant \`\`${prefix}\`\``, msg);

};

module.exports = {
    name: "config prefix",
    category: "config",
    description: "Permet de configurer le préfix du serveur.",
    usage: "``<nouveau prefix>``",
    aliases: ["prefix"],
    permissions: ["MANAGE_GUILD"],
    run: run
};