const { Client } = require('discord.js');

/**
 * @param {Client} client 
 */
module.exports = async (client) => {
    client.on('ready', () => {
        client.config.emojis.guildsID.forEach(guildID => {
            client.guilds.cache.get(guildID).emojis.cache.forEach(e => {
                if(Object.values(client.config.emojis).includes(e.name)) client.emotes.set(e.name, e);
            });
        });
        ["functions"].forEach(handler => {
            require(`./${handler}`)(client);
        });
    });
};