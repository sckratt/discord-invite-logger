require('dotenv').config();


const { Client, Collection, Message, MessageEmbed } = require('discord.js');
const chalk = require('chalk');
const colors = require('hexacolors');

const client = new Client();
client.commands = new Collection();
client.aliases = new Collection();
client.config = require('../config');
client.emotes = new Collection();

try {
    client.login(process.env.token);
} catch {
    console.log(
        chalk.red("[!] Impossible de se connecter à Discord. Veuillez vérifier que le token fourni est valide !")
    );
};

//? HANDLER
["commands", "emojis"].forEach(handler => {
    require(`./handler/${handler}`)(client);
});

//? EVENTS
["ready", "disconnect", "message", "guildMemberAdd", "guildMemberRemove"].forEach(event => {
    client.on(event, (x, y) => require(`./events/${event}`)(client, x, y));
});
