const dotenv = require('dotenv');
dotenv.config({
    path: `${__dirname}/../.env`,
});

const { Dashboard, FormOptionsBuilders, GroupBuilders } = require('../../dist');
const { PermissionsBitField } = require('discord.js');
const ConnectMongo = require('connect-mongo');

const dashboard = new Dashboard(
    {
        api: {
            protocol: 'http',
            domain: 'localhost',
            port: 3000,

            session: {
                secret: process.env.SESSION_SECRET,
            },

            guild_management: {
                permissions_required: new PermissionsBitField([
                    PermissionsBitField.Flags.ManageGuild,
                ]),
            },
        },

        discord_oauth2: {
            client_id: process.env.DISCORD_OAUTH_CLIENT_ID,
            client_secret: process.env.DISCORD_OAUTH_CLIENT_SECRET,
        },

        assistants_technologies: {
            token: '',
        },
    },
    {
        name: 'ph',
        inject: async () => {},
    },
)
    .setCustomSessionStore(
        ConnectMongo.create({
            mongoUrl: process.env.MONGO_URL,
        }),
    )
    .setGuildOptions([
        new GroupBuilders.Guild()
            .setId('123')
            .setMeta({
                name: 'Uno',
                description: 'The first group',
            })
            .setOptions([
                new FormOptionsBuilders.Guild.TextInputBuilder()
                    .setId('hey')
                    .setMeta({
                        name: '',
                        description: '',
                    })
                    .onRequest(async (user_id, guild_id) => {
                        return 'Sample data!';
                    })
                    .onUpdate(async (user_id, guild_id, value) => {
                        return '';
                    })
                    .onAccessCheck(async (user_id, guild_id) => true)
                    .build(),
            ])
            .build(),
    ]);

module.exports = dashboard;
