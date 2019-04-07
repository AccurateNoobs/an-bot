module.exports = class {
    constructor(client){
        this.client = client;
    }

    async run(message) {
        const prefix = this.client.config['botDefaults']['prefix'];

        if (this.client.config['users']['blacklisted'].includes(message.member.id)) return;
        if (message.author.bot) return;
        if (!message.content.startsWith(prefix)) return;

        let args = message.content.slice(prefix.length).trim().split(/ +/g);
        let command = args.shift().toLocaleLowerCase();

        let level = this.client.getUserPermLevel(message);

        const cmd = this.client.commands.get(command) || this.client.commands.get(this.client.aliases.get(command));
        if (!cmd) return;

        if (cmd && !message.guild && cmd.conf.guildOnly)
            return message.channel.send('This command is only accessible via a guild, Try in a guild.');
        
        if (level < this.client.levelCache[cmd.conf.permLevel]) {
            if (this.client.config['botDefaults']['systemNotice'] === true) {
                message.channel.send({
                    embed: {
                        title: '**Permission Issue.**',
                        color: this.client.color,
                        thumbnail: {
                            url: this.client.user.avatarURL
                        },
                        fields: [
                            {
                                name: 'Your Level',
                                value: `${this.client.config['permCheck'].find(lvl => lvl.level == level).name} (${level})`
                            },
                            {
                                name: 'Required Level',
                                value: `${this.client.levelCache[cmd.conf.permLevel]} (${this.client.config['permCheck'].find(lvl => lvl.name == this.client.levelCache[cmd.conf.permLevel]).level})`
                            }
                        ],
                        timestamp: Date.now()
                    }
                });
                return;
            }
            return;
        }

        message.author.permLevel = level;
        cmd.run(message, args, level);
        return;
    }
}