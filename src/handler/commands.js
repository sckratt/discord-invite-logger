const { readdirSync } = require('fs');
const chalk = require('chalk');

module.exports = (client) => {
    let loaded = 0;
    let errors = 0;
    readdirSync("./src/commands").forEach(dir => {
        const files = readdirSync(`./src/commands/${dir}`);
        for (let file of files) {
            const pull = require(`../commands/${dir}/${file}`);
            if(pull.name) {
                client.commands.set(pull.name, pull);
                if(pull.aliases && Array.isArray(pull.aliases)) pull.aliases.forEach(alias => client.aliases.set(alias, pull.name));
                loaded++
            } else {
                errors++
            };
        };
    });
    console.log(
        chalk.green(`[+] ${loaded} commandes chargées.`)
    );
    if(errors > 0) console.log(
        chalk.red(`[!] ${errors} erreurs de chargement.`)
    );
};