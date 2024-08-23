import {
    Dashboard,
    GroupBuilders,
    FormOptionBuilders,
    ResponseStatusBuilders,
} from '../';

import config from './configs/default/discord-dashboard.config';
import BaseTheme from '@discord-dashboard/base-theme';
import MongoStore from 'connect-mongo';

new Dashboard(config, new BaseTheme())
    .setGuildOptions([
        new GroupBuilders.Guild()
            .setOptions([
                new FormOptionBuilders.Guild.TextInputBuilder()
                    .setId('option1')
                    .onRequest(async (user_id: string, guild_id: string) => {
                        return 'g!';
                    })
                    .onUpdate(
                        async (
                            user_id: string,
                            guild_id: string,
                            data: string,
                        ) => {
                            return ResponseStatusBuilders.SetResponses.Ok();
                        },
                    )
                    .build(),
                new FormOptionBuilders.Guild.TextInputBuilder()
                    .setId('option2')
                    .onRequest(async (user_id: string, guild_id: string) => {
                        return 'e';
                    })
                    .onUpdate(
                        async (
                            user_id: string,
                            guild_id: string,
                            data: string,
                        ) => {
                            return ResponseStatusBuilders.SetResponses.Error(
                                'error msg but could be null',
                            );
                        },
                    )
                    .build(),
                new FormOptionBuilders.Guild.TextInputBuilder()
                    .setId('lol')
                    .setMeta({
                        a: 4,
                    })
                    .onRequest(async (user_id: string, guild_id: string) => {
                        return 'g!';
                    })
                    .onUpdate(
                        async (
                            user_id: string,
                            guild_id: string,
                            data: string,
                        ) => {
                            return ResponseStatusBuilders.SetResponses.Ok();
                        },
                    )
                    .onAccessCheck(
                        async (user_id: string, guild_id: string) => {
                            return ResponseStatusBuilders.AccessControlResponses.Disallowed(
                                true,
                                'disallowed but a whole category could also be disallowed.',
                            );
                        },
                    )
                    .build(),
            ])
            .setId('group1')
            .setMeta({
                name: 'Group 1',
            })
            .build(),
    ])
    .setCustomSessionStore(
        MongoStore.create({ mongoUrl: 'mongodb://localhost/test-app' }),
    )
    .start();
