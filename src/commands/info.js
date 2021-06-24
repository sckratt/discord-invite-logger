const { Client, MessageEmbed, Message, User, MessageButton, MessageActionRow } = require('discord.js');
const db = require('quick.db');
const { colors, fromIntToDate } = require('discord-toolbox');
const config = require('../../config.json');
const moment = require('moment');

/**
 * @param {Client} client 
 * @param {Message} msg
 * @param {string[]} args
 */
const run = async (client, msg, args) => {
    let member = args[0] ? msg.mentions.members.first() || msg.guild.members.cache.get(args[0]) : msg.member;
    if(!member || member.user.bot) return client.sendError(msg, "Aucun membre n'a été trouvé...");

    if(!db.has(`users.${member.user.id}`)) {
        db.set(`users.${member.user.id}`, {
            id: member.user.id,
            joins: [{
                at: member.joinedAt.setHours(member.joinedAt.getHours() +1),
                by: undefined,
                inviteCode: undefined
            }],
            invites: {
                normal: 0,
                left: 0,
                fake: 0,
                bonus: 0
            }
        })
    }; let user = db.get(`users.${member.user.id}`);

    let regularInvites = `${member.user.id == msg.author.id ? "**Vous** avez" : member.user.toString() + " a"} **${Object.values(user.invites).reduce((x,y)=>x+y)}** invitations.\n\n` +
        `✅ \`\`${user.invites.normal}\`\` **Invités**\n` +
        `❌ \`\`${user.invites.left}\`\` **Partis**\n` +
        `💩 \`\`${user.invites.fake}\`\` **Invalidés**\n` +
        `✨ \`\`${user.invites.bonus}\`\` **Bonus**`;

    let rank = Object.values(db.get("users"))
        .sort((a,b) => Object.values(b.invites).reduce((x,y)=>x+y) - Object.values(a.invites).reduce((x,y)=>x+y))
    
    let embed = new MessageEmbed()
        .setColor(colors.blue)
        .setAuthor(member.user.tag, member.user.displayAvatarURL({ format: "png" }))
        .addField(
            "__Invité par__",
            user.joins.length ? user.joins[user.joins.length-1].by == "vanity" ? "URL personnalisée" : user.joins[user.joins.length-1].by ? (client.users.cache.get(user.joins[user.joins.length-1].by) || await client.users.fetch(user.joins[user.joins.length-1].by)).toString() : "❌ **Introuvable**" : "❌ **Introuvable**",
            true
        ).addField("\u200b", "\u200b", true)
        .addField(
            "__Rejoint le__",
            moment.utc(member.joinedAt.setHours(member.joinedAt.getHours() +2)).format("DD/MM/YYYY à HH:mm:ss") + "\n" +
            `(il y a **${fromIntToDate(Date.now() - member.joinedTimestamp, "fr")}**)`,
            true
        ).addField(
            "__Invitations régulières__",
            regularInvites
        ).addField(
            "__Invitations actives__",
            (await msg.guild.fetchInvites()).filter(i => i.inviter.id == member.user.id)
            .sort((a,b) => b.createdTimestamp - a.createdTimestamp)
            .array().slice(0, 10)
            .map(i => {
                return `**${i.code}** - ${i.channel.toString()} - il y a **${fromIntToDate(Date.now() - i.createdTimestamp, "fr")}**`
            }).join("\n") || "❌ **Aucune**"
        ).addField(
            "__Derniers membres invités__",
            msg.guild.members.cache.filter(m => db.has(`users.${m.user.id}`) && db.get(`users.${m.user.id}`).joins.length && db.get(`users.${m.user.id}`).joins[db.get(`users.${m.user.id}`).joins.length-1].by == member.user.id)
            .sort((a,b) => b.joinedTimestamp - a.joinedTimestamp)
            .array().slice(0, 10)
            .map(m => {
                let u = db.get(`users.${m.user.id}`);
                return `${m.user.toString()} - **${u.joins[u.joins.length-1].inviteCode}** - il y a **${fromIntToDate(Date.now() - (u.joins[u.joins.length-1].at -7200000))}**`
            }).join("\n") || "❌ **Aucun**"
        ).setFooter(`Demandé par: ${msg.author.tag}`)

    let invitedHistory = new MessageButton()
        .setCustomID(`invited-history_${member.user.id}_${msg.author.id}`)
        .setStyle("SECONDARY")
        .setLabel("Voir l'historique des membres invités")

    let invitesHistory = new MessageButton()
        .setCustomID(`invites-list_${member.user.id}_${msg.author.id}`)
        .setStyle("SECONDARY")
        .setLabel("Voir l'historique des invitations")

    let invitedHistoryActionRaw = new MessageActionRow()
        .addComponents([invitedHistory, invitesHistory])
    msg.channel.send({ embeds: [embed], components: [invitedHistoryActionRaw] });
};

module.exports = {
    aliases: ["infos"],
    description: "Permet de voir votre nombre d'invitations",
    run: run
};