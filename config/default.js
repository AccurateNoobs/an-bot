const config = {
    "dashboard": {
        "oauthSecret": 'OyaxDdP2wZVZLGq76Lc1eAnG1aMyuf8R',
        "callbackURL": 'localhost:3000/callback',
        "domain": 'localhost:3000',
        "port": 3000,
        "sessionSecret": 'whysoezclap'
    },
    "botDefaults": {
        "prefix": 'AN.',
        "logChannel": {
            "name": 'mod-logs',
            "id": null
        },
        "modRole": 'Moderator',
        "adminRole": 'Admin',
        "welcome": {
            "channel": {
                "name": 'welcomes',
                "id": null
            },
            "enabled": true,
            "message": 'Welcome {{ user }}! Have fun in {{ guild }}.'
        },
        "systemNotice": true
    },
    "users": {
        "admins": ["472571500637978626", "481857120548028447"],
        "support": [],
        "blacklisted": ["184746253223985153"]
    },
    "permCheck": [
        {
            "name": 'User',
            "level": 0,
            "check": () => {
                return 'true';
            }
        },
        {
            "name": 'Developer',
            "level": 12,
            "check": (message) => {
                if (config['users']['admins'].includes( message.member.id || message.author.id )) {
                    return 'true';
                }
                return 'false';
            }
        }
    ]
}

module.exports = config;