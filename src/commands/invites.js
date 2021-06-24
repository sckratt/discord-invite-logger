const { Client, MessageEmbed, Message } = require('discord.js');
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
    console.log("GOOD");

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

    let rank = Object.values(db.get("users"))
        .sort((a,b) => Object.values(b.invites).reduce((x,y)=>x+y) - Object.values(a.invites).reduce((x,y)=>x+y))

    let embed = new MessageEmbed()
        .setColor(colors.blue)
        .setAuthor(member.user.tag, member.user.displayAvatarURL({ format: "png" }))
        .setDescription(
            `${member.user.id == msg.author.id ? "**Vous** avez" : member.user.toString() + " a"} **${Object.values(user.invites).reduce((x,y)=>x+y)}** invitations.\n\n` +
            `✅ \`\`${user.invites.normal}\`\` **Invités**\n` +
            `❌ \`\`${user.invites.left}\`\` **Partis**\n` +
            `💩 \`\`${user.invites.fake}\`\` **Invalidés**\n` +
            `✨ \`\`${user.invites.bonus}\`\` **Bonus**\n\n` +
            `Actuellement **${(rank.map(r => r.id).indexOf(member.user.id)+1).toLocaleString("fr")}e** / ${msg.guild.members.cache.filter(m => !m.user.bot).size}`
        ).setFooter(`Demandé par: ${msg.author.tag}`, msg.author.displayAvatarURL({ format: "png" }))
    msg.channel.send({ embeds: [embed] });
};

module.exports = {
    aliases: ["inv"],
    description: "Permet de voir votre nombre d'invitations",
    run: run
};