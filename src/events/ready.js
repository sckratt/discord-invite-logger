const { Client } = require('discord.js');
const db = require('quick.db');
const translate = require('../translate');

/**
 * 
 * @param {Client} client 
 */
module.exports = async (client) => {
    if(!db.has("invites")) db.set("invites", {});
    if(!db.has("users")) db.set("users", {});
    console.log(`${translate("Connecté en tant que", "Connected as")} ${client.user.tag}`);
    let guildInvites = (await client.guilds.cache.get(require('../../config.json').serverID).invites.fetch());
    guildInvites
        .forEach(i => {
            db.set(`invites.${i.code}`, {
                inviterId: i.inviter?.id,
                code: i.code,
                uses: i.uses
            });
        });
    Object.values(db.get("invites"))
        .filter(i => !guildInvites.has(i.code))
        .forEach(i => db.delete(`invites.${i.code}`))
}
