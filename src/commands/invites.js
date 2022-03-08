const { Client, MessageEmbed, Message } = require('discord.js');
const db = require('quick.db');
const { colors, fromIntToDate } = require('discord-toolbox');
const config = require('../../config.json');
const moment = require('moment');
const translate = require('../translate');

/**
 * @param {Client} client 
 * @param {Message} msg
 * @param {string[]} args
 */
const run = async (client, msg, args) => {
    let member = args[0] ? msg.mentions.members.first() || msg.guild.members.cache.get(args[0]) : msg.member;
    if(!member || member.user.bot) return client.sendError(msg, translate("Aucun membre n'a été trouvé...", "No members were found..."));

    if(!db.has(`users.${member.user.id}`)) {
        db.set(`users.${member.user.id}`, {
            id: member.user.id,
            joins: [{
                at: member.joinedAt.setHours(member.joinedAt.getHours() +1),
                by: undefined,
                inviteCode: undefined
            }], bonusHistory: [],
            invites: {
                normal: 0,
                left: 0,
                fake: 0,
                bonus: 0
            }
        })
    }; let user = db.get(`users.${member.user.id}`);

    let rank = Object.values(db.get("users"))
        .sort((a,b) => Object.values(b.invites).reduce((x,y)=>x+y) - Object.values(a.invites).reduce((x,y)=>x+y))

    let embed = new MessageEmbed()
        .setColor(colors.yellow)
        .setAuthor({ name: member.user.tag, iconURL: member.user.displayAvatarURL({ format: "png" }) })
        .setDescription(
            `${member.user.id == msg.author.id ? translate("**Vous** avez", "**You** have") : member.user.toString() + translate(" a", " has")} **${Object.values(user.invites).reduce((x,y)=>x+y)}** ${translate("invitations", "invites")}.\n\n` +
            `✅ \`\`${user.invites.normal}\`\` **${translate("Invités", "Invited")}**\n` +
            `❌ \`\`${user.invites.left}\`\` **${translate("Partis", "Left")}**\n` +
            `💩 \`\`${user.invites.fake}\`\` **${translate("Invalidés", "Invalid")}**\n` +
            `✨ \`\`${user.invites.bonus}\`\` **Bonus**\n\n` +
            `${translate("Actuellement", "Currently")} **${(rank.map(r => r.id).indexOf(member.user.id)+1).toLocaleString("fr")}${translate("e", rank.map(r => r.id).indexOf(member.user.id)+1 == 1 ? "st" : rank.map(r => r.id).indexOf(member.user.id)+1 == 2 ? "nd" : rank.map(r => r.id).indexOf(member.user.id)+1 == 3 ? "rd" : "th")}** / ${msg.guild.members.cache.filter(m => !m.user.bot).size}`
        ).setFooter(`${translate("Demandé par", "Asked by")}: ${msg.author.tag}`, msg.author.displayAvatarURL({ format: "png" }))

    msg.channel.send({ embeds: [embed] });
};

module.exports = {
    aliases: ["inv"],
    description: "Permet de voir votre nombre d'invitations",
    run: run
};