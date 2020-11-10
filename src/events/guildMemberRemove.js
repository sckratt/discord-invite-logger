const { Client, GuildMember } = require('discord.js');
const db = require('quick.db');
const moment = require('moment');

/**
 * @param {Client} client
 * @param {GuildMember} guildMember
 */
module.exports = async (client, guildMember) => {
    if(!guildMember.guild.available) return;

    if(db.has(`userInvites.${guildMember.guild.id}.${guildMember.user.id}`)) {
        let member = db.get(`userInvites.${guildMember.guild.id}.${guildMember.user.id}`);
        let lastJoined = member.joined[member.joined.length - 1];
        if(db.has(`userInvites.${guildMember.guild.id}.${lastJoined.by}`)) {
            if(lastJoined.fake) {
                db.subtract(`userInvites.${guildMember.guild.id}.${lastJoined.by}.count.fakes`, 1);
                db.add(`userInvites.${guildMember.guild.id}.${lastJoined.by}.count.leaves`, 1);
            } else {
                db.add(`userInvites.${guildMember.guild.id}.${lastJoined.by}.count.leaves`, 1);
            };
        };
    };
};