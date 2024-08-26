import dotenv from 'dotenv';
import {
    Config,
    Environment,
    Protocol,
} from '@discord-dashboard/typings/dist/Config';
import { PermissionsBitField } from 'discord.js';
import path from 'node:path';

dotenv.config({
    path: path.join(__dirname, '../../.env'),
});

declare var process: {
    env: {
        SESSION_SECRET: string;
        MONGO_URL: string;

        DISCORD_OAUTH_CLIENT_ID: string;
        DISCORD_OAUTH_CLIENT_SECRET: string;

        DISCORD_BOT_TOKEN: string;

        ASSISTANTS_TECHNOLOGIES_TOKEN: string;

        SESSION_ID_COOKIE: string;
    };
};

const config: Config = {
    environment: Environment.DEVELOPMENT,

    api: {
        protocol: Protocol.HTTP,
        domain: 'localhost',
        port: 3000,

        guild_management: {
            permissions_required: new PermissionsBitField([
                PermissionsBitField.Flags.ManageGuild,
            ]),
        },

        session: {
            secret: process.env.SESSION_SECRET,
        },
    },

    discord: {
        oauth2: {
            client_id: process.env.DISCORD_OAUTH_CLIENT_ID,
            client_secret: process.env.DISCORD_OAUTH_CLIENT_SECRET,
        },

        bot: {
            token:  process.env.DISCORD_BOT_TOKEN,
        },
    },

    assistants_technologies: {
        token: process.env.ASSISTANTS_TECHNOLOGIES_TOKEN,
    },
};

export default config;
