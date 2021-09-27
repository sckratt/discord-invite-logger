# Disord Invite Logger Bot - Discord.js v13.1.0

# Instruction
1.  Installer [Node.js](https://nodejs.org/en/).
2.  Cliquez sur le fichier __**install.bat**__ qui vous permet d'installer les dépendances.
3.  Créer une application en se connectant au [Portail Developers](https://discordapp.com/developers/applications/) sur le site de Discord puis activez l'options bot via l'onglet **Bot** et récupérez le token.
4.  En bas de la page de l'onglet **Bot**, activez le __**SERVER MEMBERS INTENT**__
    ![Server Members Instent](https://i.imgur.com/ywbvEv0.png)
6.  Ouvrir le fichier __**config.json**__.
7.  Entrez les informations demandées.
8.  Créez un fichier __**.env**__ à la racine du projet, puis entrez votre token dedans comme ci-dessous :
```
token=TON_TOKEN
```
9.  Invitez votre bot via le lien d'invitation via l'onglet **OAuth2**.
10. Enfin, pour lancer le bot, double-cliquez sur le fichier __**start.bat**__
11. Si vous avez des questions, ouvrez un commentaire dans l'onglet GitHub **[Issues](https://github.com/aeziotech/discord-invite-logger/issues)**.
12. Voici les variables possible dans la configuration des message du __**config.json**__ :
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

### Plus de fonctionnalités à venir... Tenez vous informé

__**REJOIGNEZ MOI SUR DISCORD :**__
[![lunarbyte-studio](https://cms-assets.tutsplus.com/cdn-cgi/image/width=850/uploads/users/1631/posts/34139/image/Twitch%20Panel%20Maker%20for%20a%20Simple%20Chat%20Button%20copy.jpg)](https://discord.gg/VzmrCga)
