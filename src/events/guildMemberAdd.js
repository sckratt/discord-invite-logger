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
    if(!db.has(`users.${guildMember.user.id}`)) db.set(`users.${guildMember.user.id}`, {
        id: guildMember.user.id,
        joins: [],
        bonusHistory: [],
        invites: {
            normal: 0,
            left: 0,
            fake: 0,
            bonus: 0
        }
    });
    let invite = (await guildMember.guild.invites.fetch())
        .find(i => db.has(`invites.${i.code}`) && db.get(`invites.${i.code}`).uses < i.uses);
    if(!invite) {
        if(db.has(`users.${guildMember.user.id}`)) {
            let updatedUserIDs = [];
            db.get(`users.${guildMember.user.id}.joins`)
                .filter(j => j.by && ![guildMember.user.id, "vanity"].includes(j.by))
                .forEach(j => {
                    if(updatedUserIDs.includes(j.by)) return;
                    updatedUserIDs.push(j.by);
                    db.add(`users.${j.by}.invites.left`, 1);
                    db.subtract(`users.${j.by}.invites.fake`, 1);
                })
        } else {
            db.set(`users.${guildMember.user.id}`, {
                id: guildMember.user.id,
                joins: [],
                invites: {
                    normal: 0,
                    left: 0,
                    fake: 0,
                    bonus: 0
                }
            })
        };
        db.push(`users.${guildMember.user.id}.joins`, {
            at: new Date().setHours(new Date().getHours() +2),
            by: undefined,
            inviteCode: undefined
        });
        let content = config.welcome.message.unknow
            .replace(/{user}/g, guildMember.user.toString())
            .replace(/{userTag}/g, guildMember.user.tag)
            .replace(/{userName}/g, guildMember.user.username)
            .replace(/{createdAt}/g, moment.utc(guildMember.user.createdAt.setHours(guildMember.user.createdAt.getHours() +2)).format("DD/MM/YYYY à HH:mm"))
            .replace(/{createdTimestamp}/g, fromIntToDate(guildMember.user.createdAt.setHours(guildMember.user.createdAt.getHours() +2), config.lang.toLowerCase()))
            .replace(/{memberCount}/g, guildMember.guild.members.cache.filter(m => !m.user.bot).size)
        if(config.welcome.isEmbed) {
            var message = new MessageEmbed()
                .setColor(config.welcome.color)
                .setDescription(content)
            guildMember.guild.channels.cache.get(config.welcome.channelId)
                .send({ embeds: [message] });
        } else {
            guildMember.guild.channels.cache.get(config.welcome.channelId)
                .send({ content: content });
        }
    } else if(invite.code == guildMember.guild.vanityURLCode) {
        if(db.has(`users.${guildMember.user.id}`)) {
            let updatedUserIDs = [];
            db.get(`users.${guildMember.user.id}.joins`)
                .filter(j => j.by && ![guildMember.user.id, "vanity"].includes(j.by))
                .forEach(j => {
                    if(updatedUserIDs.includes(j.by)) return;
                    updatedUserIDs.push(j.by);
                    db.add(`users.${j.by}.invites.left`, 1);
                    db.subtract(`users.${j.by}.invites.fake`, 1);
                })
        } else {
            db.set(`users.${guildMember.user.id}`, {
                id: guildMember.user.id,
                joins: [],
                invites: {
                    normal: 0,
                    left: 0,
                    fake: 0,
                    bonus: 0
                }
            })
        }; if(!db.has(`users.vantiy`)) {
            db.set(`users.vantiy`, 0);
        }; db.add(`users.vanity`, 1);

        db.push(`users.${guildMember.user.id}.joins`, {
            at: guildMember.joinedAt.setHours(guildMember.joinedAt.getHours() +2),
            by: "vanity",
            inviteCode: invite.code
        });
        let content = config.welcome.message.vanity
            .replace(/{user}/g, guildMember.user.toString())
            .replace(/{userTag}/g, guildMember.user.tag)
            .replace(/{userName}/g, guildMember.user.username)
            .replace(/{createdAt}/g, moment.utc(guildMember.user.createdAt.setHours(guildMember.user.createdAt.getHours() +2)).format("DD/MM/YYYY à HH:mm"))
            .replace(/{createdTimestamp}/g, fromIntToDate(guildMember.user.createdAt.setHours(guildMember.user.createdAt.getHours() +2), config.lang.toLowerCase()))
            .replace(/{inviteCode}/g, invite.code)
            .replace(/{memberCount}/g, guildMember.guild.members.cache.filter(m => !m.user.bot).size)
        if(config.welcome.isEmbed) {
            var message = new MessageEmbed()
                .setColor(config.welcome.color)
                .setDescription(content)
            guildMember.guild.channels.cache.get(config.welcome.channelId)
                .send({ embeds: [message] });
        } else {
            guildMember.guild.channels.cache.get(config.welcome.channelId)
                .send({ content: content });
        }
    } else if(invite.inviter?.id == guildMember.user.id) {
        if(db.has(`users.${guildMember.user.id}`)) {
            let updatedUserIDs = [];
            db.get(`users.${guildMember.user.id}.joins`)
                .filter(j => j.by && ![guildMember.user.id, "vanity"].includes(j.by))
                .forEach(j => {
                    if(updatedUserIDs.includes(j.by)) return;
                    updatedUserIDs.push(j.by);
                    db.add(`users.${j.by}.invites.left`, 1);
                    db.subtract(`users.${j.by}.invites.fake`, 1);
                })
        } else {
            db.set(`users.${guildMember.user.id}`, {
                id: guildMember.user.id,
                joins: [],
                invites: {
                    normal: 0,
                    left: 0,
                    fake: 0,
                    bonus: 0
                }
            })
        };

        db.push(`users.${guildMember.user.id}.joins`, {
            at: guildMember.joinedAt.setHours(guildMember.joinedAt.getHours() +2),
            by: guildMember.user.id,
            inviteCode: invite.code
        });
        let content = config.welcome.message['self-invite']
            .replace(/{user}/g, guildMember.user.toString())
            .replace(/{userTag}/g, guildMember.user.tag)
            .replace(/{userName}/g, guildMember.user.username)
            .replace(/{createdAt}/g, moment.utc(guildMember.user.createdAt.setHours(guildMember.user.createdAt.getHours() +2)).format("DD/MM/YYYY à HH:mm"))
            .replace(/{createdTimestamp}/g, fromIntToDate(guildMember.user.createdAt.setHours(guildMember.user.createdAt.getHours() +2), config.lang.toLowerCase()))
            .replace(/{inviteCode}/g, invite.code)
            .replace(/{memberCount}/g, guildMember.guild.members.cache.filter(m => !m.user.bot).size)
        if(config.welcome.isEmbed) {
            var message = new MessageEmbed()
                .setColor(config.welcome.color)
                .setDescription(content)
            guildMember.guild.channels.cache.get(config.welcome.channelId)
                .send({ embeds: [message] });
        } else {
            guildMember.guild.channels.cache.get(config.welcome.channelId)
                .send({ content: content });
        }
    } else {
        if(db.has(`users.${guildMember.user.id}`)) {
            let updatedUserIDs = [];
            db.get(`users.${guildMember.user.id}.joins`)
                .filter(j => j.by && ![guildMember.user.id, invite.inviter.id, "vanity"].includes(j.by))
                .forEach(j => {
                    if(updatedUserIDs.includes(j.by)) return;
                    updatedUserIDs.push(j.by);
                    db.add(`users.${j.by}.invites.left`, 1);
                    db.subtract(`users.${j.by}.invites.fake`, 1);
                })
        } else {
            db.set(`users.${guildMember.user.id}`, {
                id: guildMember.user.id,
                joins: [],
                invites: {
                    normal: 0,
                    left: 0,
                    fake: 0,
                    bonus: 0
                }
            })
        };
        if(db.get(`users.${guildMember.user.id}.joins`).map(j => j.by).includes(invite.inviter.id)) db.add(`users.${invite.inviter.id}.invites.left`, 1);
        else if(!db.has(`users.${invite.inviter.id}`)) {
            db.set(`users.${invite.inviter.id}`, {
                id: invite.inviter.id,
                joins: [],
                invites: {
                    normal: 1,
                    left: 0,
                    fake: 0,
                    bonus: 0
                }
            })
        } else db.add(`users.${invite.inviter.id}.invites.normal`, 1);

        db.push(`users.${guildMember.user.id}.joins`, {
            at: guildMember.joinedAt.setHours(guildMember.joinedAt.getHours() +2),
            by: invite.inviter.id,
            inviteCode: invite.code
        });

        let content = config.welcome.message.success
            .replace(/{user}/g, guildMember.user.toString())
            .replace(/{userTag}/g, guildMember.user.tag)
            .replace(/{userName}/g, guildMember.user.username)
            .replace(/{createdAt}/g, moment.utc(guildMember.user.createdAt.setHours(guildMember.user.createdAt.getHours() +2)).format("DD/MM/YYYY à HH:mm"))
            .replace(/{createdTimestamp}/g, fromIntToDate(new Date(guildMember.user.createdAt.setHours(guildMember.user.createdAt.getHours() +2)).getTime(), config.lang.toLowerCase()))
            .replace(/{inviteCode}/g, invite.code)
            .replace(/{memberCount}/g, guildMember.guild.members.cache.filter(m => !m.user.bot).size)
            .replace(/{inviter}/g, invite.inviter.toString())
            .replace(/{inviterTag}/g, invite.inviter.tag)
            .replace(/{inviterName}/g, invite.inviter.username)
            .replace(/{inviteCount}/g, Object.values(db.get(`users.${invite.inviter.id}.invites`)).reduce((x,y)=>x+y))
        if(config.welcome.isEmbed) {
            var message = new MessageEmbed()
                .setColor(config.welcome.color)
                .setDescription(content)
            guildMember.guild.channels.cache.get(config.welcome.channelId)
                .send({ embeds: [message] });
        } else {
            guildMember.guild.channels.cache.get(config.welcome.channelId)
                .send({ content: content });
        }
    };

    try {
        const newInvites = await guildMember.guild.invites.fetch();
        newInvites.forEach(newInvite => {
            db.set(`invites.${newInvite.code}`, {
                inviterId: guildMember.user?.id,
                code: newInvite.code,
                uses: newInvite.uses
            });
        });
    } catch (err) {
        console.error(err);
    }
};
