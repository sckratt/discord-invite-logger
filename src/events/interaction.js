const { Client, MessageEmbed, Interaction, MessageButton, MessageActionRow } = require('discord.js');
const db = require('quick.db');
const { colors, fromIntToDate } = require('discord-toolbox');
const config = require('../../config.json');
const moment = require('moment');
const translate = require('../translate');

/**
 * @param {Client} client 
 * @param {Interaction} interaction 
 */
module.exports = async (client, interaction) => {
    if(!interaction.isButton()) return;
    if(interaction.customID.startsWith("invited-history") && interaction.customID.split("_")[2] == interaction.user.id) {
        const member = interaction.guild.members.cache.get(interaction.customID.split("_")[1]);
        const author = interaction.user;
        if(!member) return interaction.update({ content: translate("Le membre a quitté le serveur.", "The member has left the server."), embeds: [], components: [] });

        let users = Object.values(db.get(`users`)).filter(u => u.joins?.map(j => j.by).includes(member.user.id));
        let invites = [];
        users.forEach((u) => {
            u.joins
            .filter(j => j.by == member.user.id)
            .forEach(j => {
                Object.assign(j, { id: u.id });
                invites.push(j);
            })
        });

        let backButton = new MessageButton()
            .setCustomID(`info_${member.user.id}_${interaction.customID.split("_")[2]}`)
            .setStyle("SECONDARY")
            .setLabel(translate("Retour aux informations du membre", "Back to the members infos"))
        let backButtonActionRaw = new MessageActionRow()
            .addComponents([backButton])

        let pages = [];
        let page = [];
        invites.sort((a,b) => b.at - a.at);
        let userUpdatedIDs = [];
        var definitiveInvites = [];
        invites.forEach(j => {
            let userDB = db.get(`users.${j.id}`)
            if(interaction.guild.members.cache.has(j.id)) {
                var left = false;
                if(userDB.joins[userDB.joins.length-1].by !== member.user.id) var fake = true;
                else if(userUpdatedIDs.includes(j.id)) var fake = true;
                else {
                    var fake = false;
                    userUpdatedIDs.push(j.id);
                };
            } else { var fake = false; var left = true; };
            definitiveInvites.push({
                at: j.at,
                by: j.by,
                inviteCode: j.inviteCode,
                id: j.id,
                fake: fake,
                left: left
            })
        });
        definitiveInvites.forEach(j => {
            page.push(j);
            if(page.length >= 20) {
                let pageEmbed = new MessageEmbed()
                    .setColor(colors.blue)
                    .setAuthor(member.user.tag, member.user.displayAvatarURL({ format: "png" }))
                    .setDescription(
                        page.filter(j => client.users.cache.has(j.id))
                        .map((join) => {
                            let user = client.users.cache.get(join.id);
                            return `${join.left ? "❌" : join.fake ? "💩" : "✅"} ${user.toString()} - **${join.inviteCode}** - ${translate(`il y a **${fromIntToDate(Date.now() +7200000 - join.at)}**`, `**${fromIntToDate(Date.now() +7200000 - join.at, config.lang.toLowerCase())}** ago`)}`
                        }).join("\n") || translate("❌ **Aucun**", "❌ **Any**")
                    ).setFooter(`${translate("Demandé par", "Asked by")}: ${author.tag}`, author.displayAvatarURL({ format: "png" }))
                pages.push(pageEmbed);
                page = [];
            };
        }); if(page.length > 0) {
            let pageEmbed = new MessageEmbed()
                .setColor(colors.blue)
                .setAuthor(member.user.tag, member.user.displayAvatarURL({ format: "png" }))
                .setDescription(
                    page.filter(j => client.users.cache.has(j.id))
                    .map((join) => {
                        let user = client.users.cache.get(join.id);
                        return `${join.left ? "❌" : join.fake ? "💩" : "✅"} ${user.toString()} - **${join.inviteCode}** - ${translate(`il y a **${fromIntToDate(Date.now() +7200000 - join.at)}**`, `**${fromIntToDate(Date.now() +7200000 - join.at, config.lang.toLowerCase())}** ago`)}`
                    }).join("\n") || translate("❌ **Aucun**", "❌ **Asked by**")
                ).setFooter(`${translate("Demandé par", "Asked by")}: ${author.tag}`, author.displayAvatarURL({ format: "png" }))
            pages.push(pageEmbed);
        };

        if(definitiveInvites.length == 0) {
            pages.push(
                new MessageEmbed()
                    .setColor(colors.red)
                    .setAuthor(member.user.tag, member.user.displayAvatarURL({ format: "png" }))
                    .setDescription(
                        `❌ - ${member.user.toString()} **${translate("n'a invité aucun membre.", "has not invited any member.")}**`
                    ).setFooter(author.tag, author.displayAvatarURL({ format: "png" }))
            )
        }

        interaction.update({ embeds: pages, components: [backButtonActionRaw] });
        await interaction.message.react("👍");
    } else if(interaction.customID.startsWith("info") && interaction.customID.split("_")[2] == interaction.user.id) {
        const author = interaction.user;
        const member = interaction.guild.members.cache.get(interaction.customID.split("_")[1]);
        if(!member) return interaction.update({ content: "Le membre a quitté le serveur.", embeds: [], components: [] });

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

        let regularInvites = `${member.user.id == interaction.customID.split("_")[2] ? "**Vous** avez" : member.user.toString() + " a"} **${Object.values(user.invites).reduce((x,y)=>x+y)}** invitations.\n\n` +
        `✅ \`\`${user.invites.normal}\`\` **${translate("Invités", "Invited")}**\n` +
        `❌ \`\`${user.invites.left}\`\` **${translate("Partis", "Left")}**\n` +
        `💩 \`\`${user.invites.fake}\`\` **${translate("Invalidés", "Invalid")}**\n` +
        `✨ \`\`${user.invites.bonus}\`\` **Bonus**`;

        let rank = Object.values(db.get("users"))
            .sort((a,b) => Object.values(b.invites).reduce((x,y)=>x+y) - Object.values(a.invites).reduce((x,y)=>x+y))
        
        let embed = new MessageEmbed()
            .setColor(colors.blue)
            .setAuthor(member.user.tag, member.user.displayAvatarURL({ format: "png" }))
            .addField(
                translate("__Invité par__", "__Invited by__"),
                user.joins.length ? user.joins[user.joins.length-1].by == "vanity" ? "URL personnalisée" : user.joins[user.joins.length-1].by ? (client.users.cache.get(user.joins[user.joins.length-1].by) || await client.users.fetch(user.joins[user.joins.length-1].by)).toString() : "❌ **Introuvable**" : "❌ **Introuvable**",
                true
            ).addField("\u200b", "\u200b", true)
            .addField(
                translate("__Rejoint le__", "__Joined on__"),
                moment.utc(member.joinedAt.setHours(member.joinedAt.getHours() +2)).format("DD/MM/YYYY à HH:mm:ss") + "\n" +
                translate(`il y a **${fromIntToDate(Date.now() - member.joinedTimestamp, "fr")}**`, `**${fromIntToDate(Date.now() - member.joinedTimestamp, "en")}** ago`),
                true
            ).addField(
                translate("__Invitations régulières__", "__Regular invites__"),
                regularInvites
            ).addField(
                translate("__Invitations actives__", "__Active invites__"),
                (await interaction.guild.fetchInvites()).filter(i => i.inviter.id == member.user.id)
                .sort((a,b) => b.createdTimestamp - a.createdTimestamp)
                .array().slice(0, 10)
                .map(i => {
                    return `**${i.code}** - ${i.channel.toString()} - ${translate(`il y a **${fromIntToDate(Date.now() - i.createdTimestamp, "fr")}**`, `**${fromIntToDate(Date.now() - i.createdTimestamp, "en")}** ago`)}`
                }).join("\n") || translate("❌ **Aucune**", "❌ **Any**")
            ).addField(
                translate("__Derniers membres invités__", "__Last invited members__"),
                interaction.guild.members.cache.filter(m => db.has(`users.${m.user.id}`) && db.get(`users.${m.user.id}`).joins.length && db.get(`users.${m.user.id}`).joins[db.get(`users.${m.user.id}`).joins.length-1].by == member.user.id)
                .sort((a,b) => b.joinedTimestamp - a.joinedTimestamp)
                .array().slice(0, 10)
                .map(m => {
                    let u = db.get(`users.${m.user.id}`);
                    return `${m.user.toString()} - **${u.joins[u.joins.length-1].inviteCode}** - ${translate(`il y a **${fromIntToDate(Date.now() - (u.joins[u.joins.length-1].at -7200000))}**`, `**${fromIntToDate(Date.now() - (u.joins[u.joins.length-1].at -7200000, config.lang.toLowerCase()))}** ago`)}`
                }).join("\n") || translate("❌ **Aucun**", "❌ **Any**")
            ).setFooter(`${translate("Demandé par", "Asked by")}: ${author.tag}`, author.displayAvatarURL({ format: "png" }))

        let invitedHistory = new MessageButton()
            .setCustomID(`invited-history_${member.user.id}_${author.id}`)
            .setStyle("SECONDARY")
            .setLabel(translate("Voir l'historique des membres invités", "Watch invited members history"))
    
        let invitesHistory = new MessageButton()
            .setCustomID(`invites-list_${member.user.id}_${author.id}`)
            .setStyle("SECONDARY")
            .setLabel(translate("Voir l'historique des invitations", "Watch active invites history"))
    
        let invitedHistoryActionRaw = new MessageActionRow()
            .addComponents([invitedHistory, invitesHistory])

        interaction.update({ embeds: [embed], components: [invitedHistoryActionRaw] });
    } else if(interaction.customID.startsWith("invites-list") && interaction.user.id == interaction.customID.split("_")[2]) {
        const author = interaction.user;
        const member = interaction.guild.members.cache.get(interaction.customID.split("_")[1]);
        if(!member) return interaction.update({ content: "Le membre a quitté le serveur.", embeds: [], components: [] });

        let invitesArray = (await interaction.guild.fetchInvites())
            .filter(i => i.inviter.id == member.user.id)
            .sort((a,b) => b.createdTimestamp - a.createdTimestamp)
            .array()
            .map(i => {
                return `**${i.code}** - ${i.channel.toString()} - ${translate(`il y a **${fromIntToDate(Date.now() - i.createdTimestamp, "fr")}**`, `**${fromIntToDate(Date.now() - i.createdTimestamp, "en")}** ago`)}`
            });
        let pages = [];
        let page = [];
        invitesArray.forEach(i => {
            page.push(i);
            if(page.length > 30) {
                pages.push(page);
                page = [];
            }
        });
        if(page.length > 0) {
            let pageEmbed = new MessageEmbed()
                .setColor(colors.blue)
                .setAuthor(member.user.tag, member.user.displayAvatarURL({ format: "png" }))
                .setFooter(`${translate("Demandé par", "Asked by")}: ${author.tag}`, author.displayAvatarURL({ format: "png" }))
                .setDescription(
                    page.join("\n")
                )
            pages.push(pageEmbed);
        };
        if(pages.length == 0) {
            pages.push(
                new MessageEmbed()
                    .setColor(colors.red)
                    .setAuthor(member.user.tag, member.user.displayAvatarURL({ format: "png" }))
                    .setDescription(
                        `❌ - ${member.user.toString()} **${translate("n'a aucune invitation", "doesn't have any invitation")}.**`
                    ).setFooter(author.tag, author.displayAvatarURL({ format: "png" }))
            )
        };
        
        let backButton = new MessageButton()
            .setCustomID(`info_${member.user.id}_${interaction.customID.split("_")[2]}`)
            .setStyle("SECONDARY")
            .setLabel(translate("Retour aux informations du membre", "Back to the members infos"))
        let backButtonActionRaw = new MessageActionRow()
            .addComponents([backButton])

        interaction.update({ embeds: pages, components: [backButtonActionRaw] })
    }
};