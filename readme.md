# Disord Invite Logger Bot - Discord.js v13
Discord Invite Logger bot est un bot qui vous permet de traquer les invitations. Il vous permettra de savoir par quel membre a été invité l'utilisateur. Il offre une interface exceptionnelle, grâce aux boutons, nouvelles fonctionnalités de Discord.

<details>
<summary>Installation LOCALHOST</summary>


1.  Installer [Node.js](https://nodejs.org/en/).
2.  Cliquez sur le fichier __**install.bat**__ qui vous permet d'installer les dépendances.
3.  Créer une application en se connectant au [Portail Developers](https://discordapp.com/developers/applications/) sur le site de Discord puis activez l'options bot via l'onglet **Bot** et récupérez le token.
4.  En bas de la page de l'onglet **Bot**, activez le __**SERVER MEMBERS INTENT**__
    ![Server Members Instent](https://i.imgur.com/ywbvEv0.png)
5. Invitez votre bot via le lien d'invitation via l'onglet **OAuth2**.
6.  Ouvrir le fichier __**config.json**__ et y entrer les informations demandées.
7.  Dans le fichier __**.env**__, entrez votre token.
8. Enfin, pour lancer le bot, double-cliquez sur le fichier __**start.bat**__
9. Si vous avez des questions ou un problème, ouvrez un commentaire dans l'onglet GitHub **[Issues](https://github.com/azynux/discord-invite-logger/issues)** ou **[rejoignez le serveur discord](https://discord.gg/QTswMhEeFd)**.
10. Voici les variables possible dans la configuration des message du __**config.json**__ :
```
{user} : Mention du membre
{userName} : Nom d'utilisateur du membre
{userTag} : Tag du membre
{createdAt} : La date de création du compte du membre
{createdTimestamp} : Le temps écoulé depuis la création du compte du membre
{inviteCode} : Le code de l'invitation qui lui a permis de rejoindre le serveur
{memberCount} : Le nombre de membre dans le serveur (ne compte pas les bots)
{inviter} : Mention du membre qui a invité
{inviterName} : Nom d'utilisateur du membre qui a invité
{inviterTag} : Tag du membre qui a invité
{inviteCount} : Nombre d'invitation du membre qui a invité
```

</details>

<details>
<summary>Installation HEBERGEUR (Pterodactyl)</summary>

1.  Créer une application en se connectant au [Portail Developers](https://discordapp.com/developers/applications/) sur le site de Discord puis activez l'options bot via l'onglet **Bot** et récupérez le token.
2.  En bas de la page de l'onglet **Bot**, activez le __**SERVER MEMBERS INTENT**__
    ![Server Members Instent](https://i.imgur.com/ywbvEv0.png)
3.  Invitez votre bot via le lien d'invitation via l'onglet **OAuth2**.
4. Copiez/collez les fichiers/dossiers dans l'onglet __**File Manager**__.
5. Ouvrir le fichier __**config.json**__ et entrez les informations demandées.
6. Dans le fichier __**.env**__, entrez votre token.
7. Dans l'onglet __**Startup**__, paramétrez le champs `BOT JS FILE` et mettez `src/index.js`
8. Allez dans l'onglet `Console` et lancez le bot.
9. Si vous avez des questions ou un problème, ouvrez un commentaire dans l'onglet GitHub **[Issues](https://github.com/azynux/discord-invite-logger/issues)** ou **[rejoignez le serveur discord](https://discord.gg/QTswMhEeFd)**.
10. Voici les variables possible dans la configuration des message du
__**config.json**__ :
```
{user} : Mention du membre
{userName} : Nom d'utilisateur du membre
{userTag} : Tag du membre
{createdAt} : La date de création du compte du membre
{createdTimestamp} : Le temps écoulé depuis la création du compte du membre
{inviteCode} : Le code de l'invitation qui lui a permis de rejoindre le serveur
{memberCount} : Le nombre de membre dans le serveur (ne compte pas les bots)
{inviter} : Mention du membre qui a invité
{inviterName} : Nom d'utilisateur du membre qui a invité
{inviterTag} : Tag du membre qui a invité
{inviteCount} : Nombre d'invitation du membre qui a invité
```

</details>

# Voir aussi
- [Discord Suggestions Manager Bot](https://github.com/azynux/discord-suggestions-bot)

### Plus de fonctionnalités à venir... Tenez vous informé !

__**REJOIGNEZ MOI SUR DISCORD ([Cliquez ici](https://discord.gg/QTswMhEeFd)) :**__
[![lunarbyte-studio](https://cms-assets.tutsplus.com/cdn-cgi/image/width=850/uploads/users/1631/posts/34139/image/Twitch%20Panel%20Maker%20for%20a%20Simple%20Chat%20Button%20copy.jpg)](https://discord.gg/QTswMhEeFd)
