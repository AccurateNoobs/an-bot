const { Client, Collection} = require('discord.js');
const { promisify } = require('util');

module.exports = class extends Client {
    constructor(options) {
        super(options);

        this.config = require('./default');
        this.commands = new Collection();
        this.aliases = new Collection();

        this.wait = promisify(setTimeout);
        this.color = Math.floor(Math.random()*16777215);
    }

    getUserPermLevel(message) {
        let level = 0;
        let levels = this.client.config['permCheck'].slice(0).sort((y, z) => y['level'] - z['level']);

        while(levels.length) {
            let current = levels.shift();
            if (message.guild && current.guildOnly) continue;
            if (current.check(message) === true) {
                level = current['level'];
                break;
            }
        }
        return level;
    }

    loadCommand(commandPath, commandName) {
        try {
            const props = new (require(`${commandPath}/${commandName}`))(this);
            props.conf.location = commandPath;
            if (props.init) {
                props.init(this);
            }
            this.commands.set(props.help.name, props);
            props.conf.aliases.forEach(alias => {
                this.aliases.set(alias, props.help.name);
            });
            return false;
        } catch (e) {
            return `Unable to load command ${commandName}: ${e}`;
        }
      }
}