const { Client, Collection, MessageEmbed, WebhookClient } = require('discord.js');
const chalk = require('chalk');
const db = require('quick.db');
const colors = require('hexacolors');
const { toRemaining, fromIntToLocalDate } = require('versus-tools');
/**
 * @param {Client} client 
 */
module.exports = async (client) => {
    console.log(
        chalk.green(`[+] Connecté à Discord en tant que ${client.user.tag} (ID: ${client.user.id})`)
    );
    let hook = {
        id: client.config.statusWebhookURL.split("/")[5],
        token: client.config.statusWebhookURL.split("/")[6],
    }; const webhook = new WebhookClient(hook.id, hook.token);
    let embed = new MessageEmbed()
        .setColor(colors.green)
        .setDescription(`${client.emotes.get("yes").toString()} ***Le bot est maintenant connecté et prêt à être utilisé.***`)
    webhook.send(embed);
    client.guilds.cache.forEach(async (guild) => {
        if(!db.has(`guilds.${guild.id}`)) {
            db.set(`guilds.${guild.id}`, {
                prefix: client.config.defaultPrefix,
                moderators: [],
                ranks: [],
                welcomeMessage: "{memberMention} a été invité par **{inviterTag}** qui a maintenant **{inviteCount}** invitations.",
                welcomeChannelID: guild.channels.cache.filter(c => c.type == "text").random().id,
                logsChannel: false,
                commandsChannelsID: false,
                ignoredChannels: []
            });
        };
        try {
            (await guild.fetchInvites()).forEach(async (invite) => {
                if(invite.code == guild.vanityURLCode) {
                    db.set(`guildInvites.${guild.id}.vanity`, invite.uses);
                } else db.set(`guildInvites.${guild.id}.${invite.code}`, invite.uses);
            });
        } catch {};
    });
};