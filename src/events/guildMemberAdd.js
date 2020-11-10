const { Client, GuildMember } = require('discord.js');
const db = require('quick.db');
const moment = require('moment');

/**
 * @param {Client} client
 * @param {GuildMember} guildMember
 */
module.exports = async (client, guildMember) => {
    if(!guildMember.guild.available) return;

    const config = db.get(`guilds.${guildMember.guild.id}`);

    try {
        let inviteSent = false;
        (await guildMember.guild.fetchInvites()).forEach(async (invite) => {
            let inviteCode = invite.code == guildMember.guild.vanityURLCode ? "vanity" : invite.code;
            if(!db.has(`guildInvites.${guildMember.guild.id}.${inviteCode}`)) db.set(`guildInvites.${guildMember.guild.id}.${inviteCode}`, 0);
            const uses = db.get(`guildInvites.${guildMember.guild.id}.${inviteCode}`);
            if(invite.uses == uses) return;
            inviteSent = true;
            
            const channel = guildMember.guild.channels.cache.get(config.welcomeChannelID);
            if(!channel || !["text", "news"].includes(channel.type)) db.set(`guilds.${guildMember.guild.id}.welcomeChannelID`, false);
            /* IF VANITY */
            if(inviteCode == "vanity") {
                db.set(`guildInvites.${guildMember.guild.id}.${inviteCode}`, invite.uses);

                //? User setup
                if(!db.has(`userInvites.${guildMember.guild.id}.${guildMember.user.id}`)) {
                    db.set(`userInvites.${guildMember.guild.id}.${guildMember.user.id}`, {
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
                        joined: []
                    });
                };
                db.push(`userInvites.${guildMember.guild.id}.${guildMember.user.id}.joined`, {
                    fake: false,
                    by: "vanity",
                    at: guildMember.joinedAt,
                    inviteCode: inviteCode
                });
                
                let message = config.welcomeMessage
                    //! INVITER PARAMS
                    .replace(/{inviterMention}/g, "L'URL personnalisé")
                    .replace(/{inviterTag}/g, "L'URL personnalisé")
                    .replace(/{inviterUsername}/g, "L'URL personnalisé")
                    .replace(/{inviterID}/g, invite.code)
                    .replace(/{inviteCount}/g, "Inconnu")
                    //! MEMBER PARAMS
                    .replace(/{memberMention}/g, guildMember.user.toString())
                    .replace(/{memberTag}/g, guildMember.user.tag)
                    .replace(/{memberUsername}/g, guildMember.user.username)
                    .replace(/{memberID}/g, guildMember.user.id)
                    .replace(/{memberCreatedAt}/g, moment.utc(guildMember.user.createdAt.setHours(guildMember.user.createdAt.getHours() + 1)).format("DD/MM/YYYY à HH:mm:ss"))
                try {
                    channel.send(message)
                } catch {};
            }
            /* IF NOT VANITY BUT USER */
            else if(invite.inviter) {
                //? Users setup
                if(!db.has(`userInvites.${guildMember.guild.id}.${guildMember.user.id}`)) {
                    db.set(`userInvites.${guildMember.guild.id}.${guildMember.user.id}`, {
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
                        joined: []
                    });
                };
                if(!db.has(`userInvites.${guildMember.guild.id}.${invite.inviter.id}`)) {
                    db.set(`userInvites.${guildMember.guild.id}.${invite.inviter.id}`, {
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
                            at: guildMember.guild.member(invite.inviter) ? guildMember.guild.member(invite.inviter).joinedAt : false,
                            inviteCode: false
                        }]
                    });
                };
                //? Fake verification
                let fake = false;

                let lastJoined = db.get(`userInvites.${guildMember.guild.id}.${guildMember.user.id}`).joined[db.get(`userInvites.${guildMember.guild.id}.${guildMember.user.id}`).joined.length - 1];
                if(lastJoined && lastJoined.by == invite.inviter.id) {
                    fake = true;
                    if(db.has(`userInvites.${guildMember.guild.id}.${invite.inviter.id}.count.leaves`)) {
                        db.subtract(`userInvites.${guildMember.guild.id}.${lastJoined.by}.count.leaves`, 1);
                    }
                };

                //? Invites update
                db.push(`userInvites.${guildMember.guild.id}.${guildMember.user.id}.joined`, {
                    fake: fake,
                    by: invite.inviter.id,
                    at: guildMember.joinedAt,
                    inviteCode: inviteCode
                });
                db.add(`userInvites.${guildMember.guild.id}.${invite.inviter.id}.count.ordinaries`, 1);
                db.add(`userInvites.${guildMember.guild.id}.${invite.inviter.id}.count.total`, 1);
                if(fake) {
                    db.add(`userInvites.${guildMember.guild.id}.${invite.inviter.id}.count.fakes`, 1);
                    db.subtract(`userInvites.${guildMember.guild.id}.${invite.inviter.id}.count.total`, 1);
                };

                //? Message Manager
                let message = config.welcomeMessage
                    //! INVITER PARAMS
                    .replace(/{inviterMention}/g, invite.inviter.toString())
                    .replace(/{inviterTag}/g, invite.inviter.tag)
                    .replace(/{inviterUsername}/g, invite.inviter.username)
                    .replace(/{inviterID}/g, invite.inviter.id)
                    .replace(/{inviteCount}/g, db.get(`userInvites.${guildMember.guild.id}.${invite.inviter.id}.count.total`))
                    //! MEMBER PARAMS
                    .replace(/{memberMention}/g, guildMember.user.toString())
                    .replace(/{memberTag}/g, guildMember.user.tag)
                    .replace(/{memberUsername}/g, guildMember.user.username)
                    .replace(/{memberID}/g, guildMember.user.id)
                    .replace(/{memberCreatedAt}/g, moment.utc(guildMember.user.createdAt.setHours(guildMember.user.createdAt.getHours() + 1)).format("DD/MM/YYYY à HH:mm:ss"))
                try {
                    channel.send(message)
                } catch {};
            }
            /* IF NOT VANITY AND NOT USER */
            else {
                //? User setup
                if(!db.has(`userInvites.${guildMember.guild.id}.${guildMember.user.id}`)) {
                    db.set(`userInvites.${guildMember.guild.id}.${guildMember.user.id}`, {
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
                        joined: []
                    });
                };
                db.push(`userInvites.${guildMember.guild.id}.${guildMember.user.id}.joined`, {
                    fake: false,
                    by: false,
                    at: guildMember.joinedAt,
                    inviteCode: inviteCode
                });
                
                let message = config.welcomeMessage
                    //! INVITER PARAMS
                    .replace(/{inviterMention}/g, "Inconnu")
                    .replace(/{inviterTag}/g, "Inconnu")
                    .replace(/{inviterUsername}/g, "Inconnu")
                    .replace(/{inviterID}/g, invite.code)
                    .replace(/{inviteCount}/g, "Inconnu")
                    //! MEMBER PARAMS
                    .replace(/{memberMention}/g, guildMember.user.toString())
                    .replace(/{memberTag}/g, guildMember.user.tag)
                    .replace(/{memberUsername}/g, guildMember.user.username)
                    .replace(/{memberID}/g, guildMember.user.id)
                    .replace(/{memberCreatedAt}/g, moment.utc(guildMember.user.createdAt.setHours(guildMember.user.createdAt.getHours() + 1)).format("DD/MM/YYYY à HH:mm:ss"))
                try {
                    channel.send(message)
                } catch {};
            }
        });
    } catch {};
};