const { Client, GuildMember, MessageEmbed } = require('discord.js');
const db = require('quick.db');
const { colors, fromIntToDate } = require('discord-toolbox');
const config = require('../../config.json');
const moment = require('moment');

/**
 * @param {Client} client 
 * @param {GuildMember} guildMember 
 */
module.exports = async (client, guildMember) => {
    if(!guildMember.guild.available || guildMember.user.bot || guildMember.guild.id !== config.serverID) return;
    if(!db.has(`users.${guildMember.user.id}`)) return;
    let user = db.get(`users.${guildMember.user.id}`);
    let updatedUserIDs = [];
    user.joins
        .filter(j => j.by && ![guildMember.user.id, "vanity", user.joins[user.joins.length-1].by].includes(j.by))
        .forEach(j => {
            if(updatedUserIDs.includes(j.by)) return;
            updatedUserIDs.push(j.by);
            db.subtract(`users.${j.by}.invites.left`, 1);
            db.add(`users.${j.by}.invites.fake`, 1);
        })
    if(user.joins[user.joins.length-1].by == "vanity") db.subtract("users.vanity", 1);
    else if(![undefined, guildMember.user.id].includes(user.joins[user.joins.length-1].by)) {
        db.subtract(`users.${user.joins[user.joins.length-1].by}.invites.left`, 1);
    }
}