const { Client, Message, MessageEmbed } = require('discord.js');
const db = require('quick.db');
const colors = require('hexacolors');

/**
 * @param {Client} client 
 * @param {Message} msg 
 * @param {Array<string>} args 
 */
const run = async (client, msg, args) => {
    let embed = new MessageEmbed()
        .setColor(client.config.embedColors)
        .setAuthor(msg.guild.name, msg.guild.iconURL())
        .addField(
            `${client.emotes.get("group").toString()} ❱ Membres`,
            msg.guild.memberCount,
            true
        ).addField("\u200b", "\u200b", true).addField(
            `${client.emotes.get("online").toString()} ❱ Connectés`,
            msg.guild.members.cache.filter(m => m.user.presence.status !== "offline").size + ` (${Math.round(msg.guild.members.cache.filter(m => m.user.presence.status !== "offline").size / msg.guild.memberCount * 100 * 100) / 100}%)`,
            true
        ).addField(
            `👥 ❱ Humains`,
            msg.guild.members.cache.filter(m => !m.user.bot).size + ` (${Math.round(msg.guild.members.cache.filter(m => !m.user.bot).size / msg.guild.memberCount * 100 * 100) / 100}%)`,
            true
        ).addField("\u200b", "\u200b", true).addField(
            `🤖 ❱ Robots`,
            msg.guild.members.cache.filter(m => m.user.bot).size + ` (${Math.round(msg.guild.members.cache.filter(m => m.user.bot).size / msg.guild.memberCount * 100 * 100) / 100}%)`,
            true
        ).addField(
            "📆 ❱ Rejoint les dernières 24h",
            msg.guild.members.cache.filter(m => m.joinedTimestamp >= Date.now() - (1000*60*60*24)).size,
            true
        ).addField("\u200b", "\u200b", true).addField(
            "📆 ❱ Rejoint cette semaine",
            msg.guild.members.cache.filter(m => m.joinedTimestamp >= Date.now() - (1000*60*60*24*7)).size,
            true
        ).addField(
            "🗓️ ❱ Rejoint ce mois",
            msg.guild.members.cache.filter(m => m.joinedTimestamp >= Date.now() - (1000*60*60*24*7*([2, 4, 6, 8, 9, 11].includes(new Date().getMonth()) ? 31 : 30))).size,
            true
        )
    msg.channel.send(embed);
};

module.exports = {
    name: "members",
    category: "invitelogger",
    description: "Envoie les statistiques des membres du serveurs.",
    run: run
};