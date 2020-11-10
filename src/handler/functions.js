const { Client } = require('discord.js');
const colors = require('hexacolors');

/**
 * @param {Client} client 
 */
module.exports = (client) => {
    /**
     * @param {string} message 
     * @param {Message} msg 
     * @returns {Promise<Message>}
     */
    client.sendError = (message, msg) => {
        let embed = new MessageEmbed()
            .setColor(colors.red)
            .setDescription(`${client.emotes.get("yes").toString()} ***${message}***`)
        return msg.channel.send(embed).catch(()=>{});
    };
    /**
     * @param {string} message 
     * @param {Message} msg 
     * @returns {Promise<Message>}
     */
    client.sendDone = (message, msg) => {
        let embed = new MessageEmbed()
            .setColor(colors.green)
            .setDescription(`${client.emotes.get("yes").toString()} ***${message}***`)
        return msg.channel.send(embed).catch(()=>{});
    };
};