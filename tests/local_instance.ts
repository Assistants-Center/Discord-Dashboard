import { Dashboard } from '../';

import config from './configs/default/discord-dashboard.config';
import BaseTheme from '@discord-dashboard/base-theme';
import MongoStore from 'connect-mongo';
import {
    guildOptions,
    userOptions,
} from './discord-dashboard/dashboard-options';

import path from 'node:path';
import dotenv from 'dotenv';

dotenv.config({
    path: path.join(__dirname, './.env'),
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

new Dashboard(config, new BaseTheme())
    .setGuildOptions(guildOptions)
    .setUserOptions(userOptions)
    .setCustomSessionStore(
        MongoStore.create({ mongoUrl: process.env.MONGO_URL }),
    )
    .start();
