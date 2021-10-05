const { Client, MessageEmbed, Message, MessageButton, MessageReaction, MessageActionRow, MessageComponentInteraction } = require('discord.js');
const db = require('quick.db');
const { colors, fromIntToDate, codeGenerator } = require('discord-toolbox');
const config = require('../../config.json');
const moment = require('moment');
const translate = require('../translate');

/**
 * @param {Client} client 
 * @param {Message} msg
 * @param {string[]} args
 */
const run = async (client, msg, args) => {
    if(!msg.member.permissions.has("MANAGE_GUILD")) return client.sendError(msg, translate("Vous n'avez pas la permission d'utiliser cette commande...", "You do not have permissions to use this command."));
    let member = args[0] ? msg.mentions.members.first() || msg.guild.members.cache.get(args[0]) : msg.member;
    if(!member || member.user.bot) return client.sendError(msg, translate("Aucun membre n'a été trouvé...", "No members were found..."));
    
    let tooLateEmbed = new MessageEmbed()
        .setColor(colors.red)
        .setDescription(`⏱️ - ${msg.author.toString()}, ${translate("vous avez mis trop de temps à répondre...", "you took too long to respond...")}`)
    let actionEmbed = new MessageEmbed()
        .setColor(colors.yellow)
        .setDescription(
            `💢 - ` + translate("**Que souhaitez-vous faire ?**", "**What do you want to do ?**")
        )
    let addButtonID = codeGenerator(50);
    let addButton = new MessageButton()
        .setCustomId(addButtonID)
        .setStyle("SUCCESS")
        .setLabel(translate("AJOUTER", "ADD"))
    let removeButtonID = codeGenerator(50);
    let removeButton = new MessageButton()
        .setCustomId(removeButtonID)
        .setStyle("DANGER")
        .setLabel(translate("RETIRER", "REMOVE"))
    let buttonsActionRaw = new MessageActionRow()
        .addComponents([addButton, removeButton]);
    
    let message = await msg.reply({ embeds: [actionEmbed], components: [buttonsActionRaw] });

    let action = "";
    let nextStep = true;
    await message.awaitMessageComponent({
        filter: (interaction) => {
            return interaction.user.id == msg.author.id && interaction.isButton();
        }, time: 30000
    }).then((interaction) => {
        switch(interaction.customId) {
            case addButtonID: action = "add";
            break; case removeButtonID: action = "subtract";
            break;
        }; interaction.deferUpdate();
    }).catch(() => {
        nextStep = false;
        message.edit({ embeds: [tooLateEmbed] });
    }); if(!nextStep) return;

    let amountEmbed = new MessageEmbed()
        .setColor(colors.yellow)
        .setDescription((action == "add" ? "📈" : "📉") + " - " + translate(`**Combien d'invitation souhaitez-vous lui ${action == "add" ? "ajouter" : "retirer"} ?**`, `**How many invites do you want to ${action} ?**`))
    await message.edit({ embeds: [amountEmbed], components: [] });
    
    let amount = await msg.channel.awaitMessages({
        filter: (m) => {
            return m.author.id == msg.author.id && Math.abs(parseInt(m.content)) > 0;
        }, max: 1,
        time: 30000,
        errors: ["time"]
    }).then(collected => {
        collected.first().delete();
        return Math.abs(parseInt(collected.first().content));
    }).catch(() => {
        nextStep = false;
        return message.edit({ embeds: [tooLateEmbed], components: [] });
    }); if(!nextStep) return;

    if(isNaN(amount)) return message.edit({ content: translate("🧐 - **Oops, un problème est survenu...**", "🧐 - **Oops, something went wrong...**"), embeds: [], components: [] });

    let reason = undefined;
    nextStep = false;
    let skipReason = false;
    let askReasonEmbed = new MessageEmbed()
        .setColor(colors.yellow)
        .setDescription(translate(`❓ - **Pourquoi lui ${action == 'add' ? "ajouter" : "retirer"} des invitations ?**`, `❓ - **Why do you want to ${action == "add" ? "add" : "remove"} invites to ${member.user.toString()} ?**`))
    let skipReasonButtonID = codeGenerator(50);
    let skipReasonButton = new MessageButton()
        .setCustomId(skipReasonButtonID)
        .setStyle("SECONDARY")
        .setLabel(translate("Passer", "Skip"))
    let skipReasonActionRaw = new MessageActionRow()
        .addComponents([skipReasonButton])
    
    await message.edit({ embeds: [askReasonEmbed], components: [skipReasonActionRaw] });

    await Promise.race([
        msg.channel.awaitMessages({
            filter: (m) => {
                return m.author.id == msg.author.id;
            }, max: 1,
            time: 40000,
            errors: ["time"]
        }).then((collected) => {
            nextStep = true;
            reason = collected.first().content;
        }).catch(() => {})
        ,
        message.awaitMessageComponent({
            filter: (interaction) => {
                return interaction.user.id == msg.author.id && interaction.isButton() && interaction.customId == skipReasonButtonID;
            }, time: 40000
        }).then((interaction) => {
            interaction.deferUpdate();
            nextStep = true;
            skipReason = true;
        }).catch(() => {})
    ]); if(!nextStep) return message.edit({ embeds: [tooLateEmbed], components: [] });

    if(!db.has(`users.${member.user.id}.bonusHistory`)) {
        db.set(`users.${member.user.id}.bonusHistory`, []);
    }; db.push(`users.${member.user.id}.bonusHistory`, {
        by: msg.author.id,
        at: new Date().setHours(new Date().getHours() +2),
        amount: amount,
        action: action,
        reason: reason
    });
    db[action](`users.${member.user.id}.invites.bonus`, amount);
    let doneEmbed = new MessageEmbed()
        .setColor(colors.green)
        .setDescription(`✅ - ${msg.author.toString()}, **${amount.toLocaleString("fr")}** ${translate(`invitations ont été ${action == "add" ? "ajoutées" : "retirées"} à ${member.user.toString()}`, `invites has been ${action}ed from ${member.user.toString()}`)}`)
    return message.edit({ embeds: [doneEmbed], components: [] })
};

module.exports = {
    aliases: ["mi"],
    description: "Permet d'ajouter ou retirer des invitations",
    run: run
};