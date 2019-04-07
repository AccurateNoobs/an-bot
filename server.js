// Data Type Extensions.
String.prototype.toProperCase = function() {
    return this.toLocaleLowerCase().split(/ +/g).map(x => x.replace(/^\w/, Char => Char.toLocaleUpperCase()) ).join(' ');
};
Array.prototype.random = function() {
    return this[Math.floor(Math.random() * this.length)];
}

// Modules:
const { promisify } = require('util');
const { freemem, totalmem } = require('os');
const readdir = promisify(require('fs').readdir);
const klaw = require('klaw');
const path = require('path');
const Client = require('./config/bot');

// Variables:
const MemoryObj = { "total": (totalmem/1024/1024/1024), "free": (freemem/1024/1024/1024) };
const client = new Client();

// Load bot:
const loadBot = async() => {
    klaw("./Commands").on("data", (item) => {
        const cmdFile = path.parse(item.path);
        if (!cmdFile.ext || cmdFile.ext !== ".js") return;
        const response = client.loadCommand(cmdFile.dir, `${cmdFile.name}${cmdFile.ext}`);
        if (response) return console.log(response);
    });

    const events = await readdir('./events/');
    events.forEach(event => {
        const eventName = event.split(/\./g)[0];
        const eventInst = new (require(path.join(__dirname, 'events', event)))(client);
        client.on(eventName, (...ezclap) => eventInst.run(...ezclap));
        delete require.cache[require.resolve(path.join(__dirname, 'events', event))];
    });

    client.login();
}

loadBot();