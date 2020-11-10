const { Client, Message, MessageEmbed } = require('discord.js');
const db = require('quick.db');
const colors = require('hexacolors');

/**
 * @param {Client} client 
 * @param {Message} msg 
 * @param {Array<string>} args 
 */
const run = async (client, msg, args) => {
    const member = args[0] ? msg.mentions.members.first() || msg.guild.members.cache.get(args[0]) : msg.member;
    if(!member) return client.sendError("Aucun membre ne correspond aux informations donnée.", msg);

    if(!db.has(`userInvites.${member.guild.id}.${member.user.id}`)) {
        db.set(`userInvites.${member.guild.id}.${member.user.id}`, {
            count: {
                ordinaries: 0,
                bonus: 0,
                fakes: 0,
                leaves: 0,
                total: 0,
                reloaded: {
                    ordinaries: 0,
                    bonus: 0,
                    fakes: 0,
                    leaves: 0,
                    total: 0,
                }
            },
            joined: [{
                fake: false,
                by: false,
                at: member.joinedAt,
                inviteCode: false
            }]
        });
    };
    const invites = db.get(`userInvites.${member.guild.id}.${member.user.id}.count`);
    let embed = new MessageEmbed()
        .setAuthor(member.user.username, member.user.displayAvatarURL())
        .setFooter(msg.author.username, msg.author.displayAvatarURL())
        .setColor(client.config.embedColors)
        .setDescription(
            `${member.user.id == msg.author.id ? "Vous" : member.user.toString()} a **${invites.total}** invitations !\n\n` +
            `✅ \`\`${invites.ordinaries}\`\` **ordinaires**\n` +
            `✨ \`\`${invites.bonus}\`\` **bonus**\n` +
            `💩 \`\`${invites.fakes}\`\` **fausses**\n` +
            `❌ \`\`${invites.leaves}\`\` **quittés**`
        )
    msg.channel.send(embed);
};

module.exports = {
    name: "invites",
    category: "invitelogger",
    description: "Envoie le récapitulatif de vos invitations ou de celle d'un membre.",
    usage: "``[@member | memberID]``",
    aliases: ["invite", "i"],
    run: run
};