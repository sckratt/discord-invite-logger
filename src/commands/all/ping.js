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
    try {
        let now = Date.now();
        let embed = new MessageEmbed()
            .setColor(client.config.embedColors)
            .setDescription(
                `${client.emotes.get("aloading").toString()} ***Pinging...***`
            )
        const message = await msg.channel.send(embed);
        embed.setDescription(
            `${client.emotes.get("yes").toString()} ***Le ping du bot est de \`\`${Date.now() - now}ms\`\`***`
        )
        message.edit(embed);
    } catch {};
};
module.exports = {
    name: "ping",
    category: "any",
    description: "``ping`` : Envoie la latence de réponse du bot.",
    run: run
};