const { Client, Guild, WebhookClient, MessageEmbed } = require('discord.js');
const colors = require('hexacolors');
const moment = require('moment');
const { toRemaining } = require('versus-tools');

/**
 * @param {Client} client 
 * @param {Guild} guild 
 */
module.exports = async (client, guild) => {
    
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

    let hook = {
        id: process.env.removeWebhookURL.split("/")[5],
        token: process.env.removeWebhookURL.split("/")[6],
    };
    const webhook = new WebhookClient(hook.id, hook.token);
    let embed = new MessageEmbed()
        .setColor(colors.red)
        .setAuthor(guild.name, guild.icon ? guild.iconURL() : "https://www.sagelewis.com/wp-content/uploads/2020/10/discord-logo.jpg")
        .addField(
            `${client.emotes.get("group").toString()} ❱ Membres`,
            `${guild.memberCount} (${(Math.round(guild.members.cache.filter(m => !m.user.bot).size / guild.memberCount * 100 * 100)/100).toString().replace(/./g, ",")}% humains)`
        ).addField(
            `👑 ❱ Owner`,
            guild.ownerID ? `❱ \`\`${guild.owner.user.tag}\`\`` : `${client.emotes.get("no").toString()} ***Introuvable***`
        ).addField(
            `⏰ ❱ Rejoins`,
            `❱ Le **${moment.utc(guild.me.joinedAt.setHours(guild.me.joinedAt.getHours() + 2)).format("DD/MM/YYYY à HH:mm:ss")}**\n` +
            `❱ Il y a **${toRemaining(Date.now() - guild.me.joinedTimestamp)}**`
        ).addField(
            `${client.emotes.get("backup").toString()} ❱ Nous sommes maintenant à`,
            `❱ **${client.guilds.cache.size}** serveurs`
        ).setFooter(`ID ➔ ${guild.id}`)
    webhook.send(embed).catch(()=>{});
};