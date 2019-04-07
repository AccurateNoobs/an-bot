module.exports = class {
    constructor(client){
        this.client = client;
    }

    async run() {
        this.client.wait(1000);
        
        this.client.appInfo = await this.client.fetchApplication();
        setInterval(async() => this.client.appInfo = await this.client.fetchApplication(), 60000);

        this.client.user.setPresence({ 
            "game": {
                "name": `${this.client.config['botDefaults']['prefix']}help | ${this.client.users.size} Users.`,
                "type": 0
            } 
        });
        console.log('\nName: %s\nGuilds: %d\nUsers: %d', this.client.user.tag, this.client.guilds.size, this.client.users.size);
    }
}