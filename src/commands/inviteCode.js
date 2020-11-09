const { Client, Message, MessageEmbed } = require('discord.js');
const db = require('quick.db');
const colors = require('hexacolors');
const { fromIntToLocalDate } = require('versus-tools');

/**
 * @param {Client} client 
 * @param {Message} msg 
 * @param {Array<string>} args 
 */
const run = async (client, msg, args) => {
    const member = args[0] ? msg.mentions.members.first() || msg.guild.members.cache.get(args[0]) : msg.member;
    if(!member) return client.sendError("Aucun membre ne correspond aux informations donnée.", msg);

    try {
        const invites = (await msg.guild.fetchInvites())
            .filter(i => i.inviter && i.inviter.id == member.user.id)
            .sort((a, b) => a.createdTimestamp - b.createdTimestamp)
            .array()
        let embed = new MessageEmbed()
            .setColor(client.config.embedColor)
            .setAuthor(`Vos invitations sur le serveur ${msg.guild.name}`, msg.guild.iconURL())
        let pages = [];
        let p = [];
        for (let i = 0; i < invites.length; i++) {
            p.push(invites[i]);
            if(p.length == 5) {
                pages.push(p);
                p = [];
            };
        }; if(p.length > 0) pages.push(p);

        let reactions = ["⬅️", "➡️"];

        embed.setDescription(`${client.emotes.get("aloading").toString()} ***En cours...***`)
        
        try {
            const message = await msg.author.send(embed);
            for (let reaction of reactions) {
                await message.react(reaction);
            };
        } catch {
            return client.sendError("Je n'ai pas pu vous envoyer le message. Veuillez débloquer vos messages privés et réessayer.", msg).catch(()=>{});
        };

        let page = 0;
        let loop = true;
        while (loop) {
            embed
                .setFooter(`Page ${page+1}/${pages.length}`)
                .setDescription(
                    pages[page].map(invite => {
                        embed.addField(
                            invite.code,
                            `**Utilisations**: ${invite.uses}\n` +
                            `**Durée maximum**: ${invite.maxAge > 0 ? fromIntToLocalDate(invite.maxAge) : "∞"}\n` +
                            `**Utilisations maximum**: ${invite.maxUses == 0 ? "∞" : invite.maxUses}\n` +
                            `**Salon**: ${invite.channel ? invite.channel.toString() : `${client.emotes.get("no").toString()}`}`
                        )
                    })
                )
            await message.edit(embed);
            let filter = (reaction, user) => {
                return reactions.includes(reaction.emoji.name) && user.id == msg.author.id;
            };
            await new Message().awaitReactions(filter, { max: 1, time: 60000, errors: ["time"] }).then(async (collected) => {
                let reaction = collected.first();
                if(reaction.emoji.name == "⬅️" && page > 0) page--;
                else if(reaction.emoji.name == "➡️" && page < pages.length-1) page++;
            });
            
            const userReactions = message.reactions.cache.filter(reaction => reaction.users.cache.has(msg.author.id));
            try {
                for (const reaction of userReactions.values()) {
                    await reaction.users.remove(msg.author.id);
                }
            } catch {};
        };
    } catch {};
};

module.exports = {
    name: "inviteCode",
    aliases: ["ic"],
    run: run
};