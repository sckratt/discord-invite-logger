const { Client, Collection, MessageEmbed, WebhookClient } = require('discord.js');
const chalk = require('chalk');
const db = require('quick.db');
const colors = require('hexacolors');
/**
 * @param {Client} client 
 * @param {any} x
 * @param {number} y
 */
module.exports = async (client, x, y) => {
    console.log(
        chalk.red(`[!] Déconnecté de Discord !`)
    );
    let hook = {
        id: client.config.statusWebhookURL.split("/")[5],
        token: client.config.statusWebhookURL.split("/")[6],
    }; const webhook = new WebhookClient(hook.id, hook.token);
    let embed = new MessageEmbed()
        .setColor(colors.red)
        .setDescription(`${client.emotes.get("yes").toString()} ***Le bot a été déconnecté.***`)
    webhook.send(embed);
};