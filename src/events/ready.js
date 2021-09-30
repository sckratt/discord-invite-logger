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
    const guild = client.guilds.cache.get(require('../../config.json').serverID);
    if(!guild) return console.log("Vous n'avez pas ajouté le bot à votre serveur !");
    try {
        var guildInvites = (await guild.invites.fetch());
    } catch {
        return console.log("Le bot n'a pas la permission de voir les invitations. Veuillez la lui attribuer.");
    };

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
