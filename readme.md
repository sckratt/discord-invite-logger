# Instruction
1.  Installer [Node.js](https://nodejs.org/en/).
2.  Cliquez sur le fichier __**install.bat**__ qui vous permet d'installer les dépendances.
3.  Créer une application en se connectant au [Portail Developers](https://discordapp.com/developers/applications/) sur le site de Discord puis activez l'options bot via l'onglet **Bot** et récupérez le token.
4.  En bas de la page de l'onglet **Bot**, activez le __**SERVER MEMBERS INTENT**__
    ![Server Members Instent](https://i.imgur.com/ywbvEv0.png)
5. Ajoutez les émojis qui se trouvent dans le dossier __/assets/emojis__ (Vous pouvez néanmoins en choisir d'autre)
6.  Ouvrir le fichier __**config.js**__.
7.  Entrez les informations demandées.
8.  Créer un fichier que vous nommerez **.env** dans lequel vous écrirez:
```
token=WWWWW
statusWebhookURL=XXXXX
addWebhookURL=YYYYY
removeWebhookURL=ZZZZZ
```
9.  Remplacer:
    * __WWWWW__ par le token de votre bot copié précédemment.
    * __XXXXX__ par le lien du webhook par lequel le bot enverra le message lorsqu'il se connectera.
    * __YYYYY__ par le lien du webhook par lequel le bot enverra le message lorsqu'il rejoindra un serveur.
    * __ZZZZZ__ par le lien du webhook par lequel le bot enverra le message lorsqu'il quittera un serveur.
10.  Invitez votre bot via le lien d'invitation via l'onglet **OAuth2**.
11.  Enfin, pour lancer le bot, double-cliquez sur le fichier __**start.bat**__
12. Si vous avez des questions, ouvrez un commentaire dans l'onglet GitHub **[Issues](https://github.com/aeziotech/bunny-logger/issues)**.

__**REJOIGNEZ MOI SUR DISCORD :**__
[![discord-banner](./assets/img/discord-banner.png)](https://discord.gg/jHkcbS9YWC)
