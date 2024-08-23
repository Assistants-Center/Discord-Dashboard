import { describe, expect, test, beforeAll, afterAll } from '@jest/globals';
import {
    Dashboard,
    GroupBuilders,
    FormOptionBuilders,
    ResponseStatusBuilders,
} from '../';

import config from './configs/default/discord-dashboard.config';
import BaseTheme from '@discord-dashboard/base-theme';

let dashboardInstance: Dashboard;

beforeAll(async () => {
    dashboardInstance = new Dashboard(config, new BaseTheme());

    dashboardInstance.setUserOptions([
        new GroupBuilders.User()
            .setId('user-options')
            .setMeta({
                name: 'User TextInput',
                yourTheme: {
                    // your interface
                },
            })
            .setOptions([
                new FormOptionBuilders.User.TextInputBuilder()
                    .setId('option')
                    .setMeta({
                        name: 'User TextInput',
                    })
                    .onUpdate(async () => {
                        return ResponseStatusBuilders.SetResponses.Ok();
                    })
                    .onRequest(async () => {
                        return '';
                    })
                    .build(),
            ])
            .build(),
    ]);

    await dashboardInstance.start();
});

afterAll(async () => {
    await dashboardInstance.stop();
});

describe('[Dashboard]', () => {
    test('[Dashboard].start is a function?', () => {});
});
