const config = require('../../config.json');
module.exports = (client, msg) => {
    if(msg.author.bot || !msg.guild || !msg.guild.available || !msg.content.startsWith(config.prefix)) return;
    let args = msg.content.slice(config.prefix.length).split(/ +/g);
    let cmd = args.shift();

    let command = client.commands.get(cmd);
    if(!command) command = client.commands.find(c => c.aliases?.includes(cmd));
    if(command) command.run(client, msg, args);
};