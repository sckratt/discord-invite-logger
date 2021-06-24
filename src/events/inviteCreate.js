const { Client, Invite } = require('discord.js');
const db = require('quick.db');

/**
 * @param {Client} client 
 * @param {Invite} guildInvite 
 */
module.exports = async (client, guildInvite) => {
    if(!guildInvite.guild.available || guildInvite.guild.id !== require('../../config.json').serverID) return;
    db.set(`invites.${guildInvite.code}`, {
        inviterId: guildInvite.inviter?.id,
        code: guildInvite.code,
        uses: guildInvite.uses
    });
};