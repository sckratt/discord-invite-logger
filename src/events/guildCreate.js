const { Client, Guild, WebhookClient, MessageEmbed } = require('discord.js');
const colors = require('hexacolors');
 
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
        id: process.env.addWebhookURL.split("/")[5],
        token: process.env.addWebhookURL.split("/")[6],
    };
    const webhook = new WebhookClient(hook.id, hook.token);
    let embed = new MessageEmbed()
        .setColor(colors.green)
        .setAuthor(guild.name, guild.icon ? guild.iconURL() : "https://www.sagelewis.com/wp-content/uploads/2020/10/discord-logo.jpg")
        .addField(
            `${client.emotes.get("group").toString()} ❱ Membres`,
            `${guild.memberCount} (${(Math.round(guild.members.cache.filter(m => !m.user.bot).size / guild.memberCount * 100 * 100)/100).toString().replace(/./g, ",")}%)`
        ).addField(
            `👑 ❱ Owner`,
            guild.ownerID ? `❱ \`\`${guild.owner.user.tag}\`\`` : `${client.emotes.get("no").toString()} ***Introuvable***`
        ).addField(
            `${client.emotes.get("activity").toString()} ❱ Activité`,
            `\`\`${guild.members.cache.filter(m => m.user.presence.status == "online").size}\`\` ${client.emotes.get("online").toString()} *❱ En ligne*` +
            `\`\`${guild.members.cache.filter(m => m.user.presence.status == "idle").size}\`\` ${client.emotes.get("idle").toString()} *❱ Inactif*` +
            `\`\`${guild.members.cache.filter(m => m.user.presence.status == "dnd").size}\`\` ${client.emotes.get("dnd").toString()} *❱ Ne pas déranger*` +
            `\`\`${guild.members.cache.filter(m => m.user.presence.status == "offline").size}\`\` ${client.emotes.get("offline").toString()} *❱ Invisible*`
        ).addField(
            `${client.emotes.get("backup").toString()} ❱ Nous sommes maintenant à`,
            `❱ **${client.guilds.cache.size}** serveurs`
        ).setFooter(`ID ➔ ${guild.id}`)
    webhook.send(embed).catch(()=>{});
};