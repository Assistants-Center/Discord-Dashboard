import { Dashboard } from '../';

import config from './configs/default/discord-dashboard.config';
import BaseTheme from '@discord-dashboard/base-theme';
import MongoStore from 'connect-mongo';
import {
    guildOptions,
    userOptions,
} from './discord-dashboard/dashboard-options';

new Dashboard(config, new BaseTheme())
    .setGuildOptions(guildOptions)
    .setUserOptions(userOptions)
    .setCustomSessionStore(
        MongoStore.create({ mongoUrl: 'mongodb://localhost/test-app' }),
    )
    .start();
