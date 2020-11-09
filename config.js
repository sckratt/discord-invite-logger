module.exports = {
    defaultPrefix: "+",
    owners: [ "746066229596258324", "772797607848312833" ],
    embedColors: "#ffaf40", //! Les ID des administrateurs du bot.

    /* STATUS */
    statusWebhookURL:   "https://discord.com/api/webhooks/775080648917385226/KqtjqZtdU2D1phFyFxshJu6EBvJZiqAlvqHN7zLNCGCl-H6yrUUWEIy5Gcq3BpP54KY4",
    addWebhookURL:      "https://discord.com/api/webhooks/775096016877518848/0P_196Kz3_jDCg0ykeLdsZZDAgxnuJTlWkbb2yYi4LddbljneGb66a1OmwKRLJkoEoQU",
    removeWebhookURL:   "https://discord.com/api/webhooks/775096016877518848/0P_196Kz3_jDCg0ykeLdsZZDAgxnuJTlWkbb2yYi4LddbljneGb66a1OmwKRLJkoEoQU",
    /* EMOJIS */ //! Veuillez fournir Le nom de l'émoji
    emojis: {
        guildsID: [ "775060039228194838" ], //? Les identifiants des serveurs dans lesquels les émojis se trouvent.
        success:    "yes",
        error:      "no",
        group:      "group",
        online:     "online",
        idle:       "idle",
        dnd:        "dnd",
        offline:    "offline",
        activity:   "activity",
        backup:     "backup",
        loading:    "aloading"
    },

    /* FONCTIONNALITES */ //! false: désactivé | true: activé
    // welcomeMessage: "◈────────◈────────◈\n│・👋 __Bienvenue à :__ {memberMention}\n│・📌 __Invité par :__ ``{inviterTag}``\n│・📝 __Il a maintenant :__ **{inviteCount}** invitations !\n◈────────◈────────◈"
    /* //? Variable disponibles:
        {inviterMention} - {inviterTag} - {inviterUsername} - {inviterID} - {inviteCount}
        {memberMention} - {memberTag} - {memberUsername} - {memberID} - {memberCreatedAt}
    */ 
}