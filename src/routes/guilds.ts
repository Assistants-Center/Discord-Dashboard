import { FastifyPluginCallback, type FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';

import errors from 'throw-http-errors';
import ErrorCodes from '@discord-dashboard/typings/dist/Core/ErrorCodes';

import { PermissionsBitField } from 'discord.js';

import { Config } from '@discord-dashboard/typings/dist/Config';

import type {
    GuildMember,
    GuildResponse,
} from '@discord-dashboard/typings/dist/Core/Guilds';
import fetchWithCache from '../wrappers/cache-wrapper';
import { authMiddleware } from '../plugins/authorization';
import { responsesSchema } from '../plugins/swagger';

const fetchUserGuilds = async (
    accessToken: string,
): Promise<GuildResponse[]> => {
    const url = 'https://discord.com/api/users/@me/guilds';
    const headers = { Authorization: `Bearer ${accessToken}` };
    return await fetchWithCache<GuildResponse[]>(url, headers);
};

const fetchGuildDetails = async (
    guildId: string,
    accessToken: string,
): Promise<GuildMember> => {
    const url = `https://discord.com/api/users/@me/guilds/${guildId}/member`;
    const headers = { Authorization: `Bearer ${accessToken}` };
    return await fetchWithCache<GuildMember>(url, headers);
};

const hasPermissionToManageGuild = (
    userPermissions: string,
    checkPermissions: PermissionsBitField,
) => {
    const permissions = new PermissionsBitField(BigInt(userPermissions));
    return permissions.has(checkPermissions);
};

const GuildsRoute: FastifyPluginCallback<{
    prefix: string;
    permissions: Config['api']['guild_management']['permissions_required'];
}> = (fastify, opts, done) => {
    fastify.get(
        opts.prefix,
        {
            schema: {
                security: [{ sessionId: [] }],
                tags: ['core'],
                response: {
                    200: {
                        description: 'Ok',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            id: { type: 'string' },
                                            name: { type: 'string' },
                                            icon: { type: ['string', 'null'] },
                                            banner: {
                                                type: ['string', 'null'],
                                            },
                                            owner: { type: 'boolean' },
                                            permissions: { type: 'integer' },
                                            permissions_new: { type: 'string' },
                                            features: {
                                                type: 'array',
                                                items: { type: 'string' },
                                            },
                                        },
                                        required: [
                                            'id',
                                            'name',
                                            'owner',
                                            'permissions',
                                            'permissions_new',
                                            'features',
                                        ],
                                    },
                                },
                                example: [
                                    {
                                        id: '803034737261936670',
                                        name: 'Assistants Technologies',
                                        icon: 'ab5b6a7828594a3f3261034bd07f65c2',
                                        banner: '3ec052446376a10480d15bffab20af2a',
                                        owner: true,
                                        permissions: 2147483647,
                                        permissions_new: '2251799813685247',
                                        features: [
                                            'GUILD_ONBOARDING',
                                            'CREATOR_MONETIZABLE_PROVISIONAL',
                                            'NEW_THREAD_PERMISSIONS',
                                            'TEXT_IN_VOICE_ENABLED',
                                            'CREATOR_ACCEPTED_NEW_TERMS',
                                            'CHANNEL_ICON_EMOJIS_GENERATED',
                                            'AUTO_MODERATION',
                                            'PREVIEW_ENABLED',
                                            'THREADS_ENABLED',
                                            'NEWS',
                                            'COMMUNITY',
                                            'GUILD_ONBOARDING_HAS_PROMPTS',
                                            'GUILD_ONBOARDING_EVER_ENABLED',
                                            'GUILD_SERVER_GUIDE',
                                            'MEMBER_VERIFICATION_GATE_ENABLED',
                                            'ROLE_SUBSCRIPTIONS_ENABLED',
                                            'SOUNDBOARD',
                                        ],
                                    },
                                    {
                                        id: '853673570289713171',
                                        name: 'Serwer użytkownika breathtake lol',
                                        icon: null,
                                        banner: null,
                                        owner: true,
                                        permissions: 2147483647,
                                        permissions_new: '2251799813685247',
                                        features: [],
                                    },
                                ],
                            },
                        },
                    },
                    401: responsesSchema['401'],
                },
            },
            preHandler: authMiddleware,
        },
        async (request, reply) => {
            const guilds = await fetchUserGuilds(
                request.session.tokens!.access_token,
            );

            const guildPermissions = await Promise.all(
                guilds.map(async (guild: GuildResponse) => {
                    try {
                        const hasPermissions = hasPermissionToManageGuild(
                            guild.permissions_new,
                            new PermissionsBitField(opts.permissions),
                        );

                        return hasPermissions && guild;
                    } catch (error) {
                        return null;
                    }
                }),
            );

            return reply.send(guildPermissions.filter((guild) => !!guild));
        },
    );

    fastify.get(
        `${opts.prefix}/:guild_id/member`,
        {
            schema: {
                security: [{ sessionId: [] }],
                tags: ['core'],
                params: {
                    type: 'object',
                    properties: {
                        guild_id: {
                            type: 'string',
                            description: 'ID of the guild',
                        },
                    },
                    required: ['guild_id'],
                },
                response: {
                    200: {
                        description: 'Ok',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        avatar: { type: ['string', 'null'] },
                                        banner: { type: ['string', 'null'] },
                                        communication_disabled_until: {
                                            type: ['string', 'null'],
                                        },
                                        flags: { type: 'integer' },
                                        joined_at: {
                                            type: 'string',
                                            format: 'date-time',
                                        },
                                        nick: { type: 'string' },
                                        pending: { type: 'boolean' },
                                        premium_since: {
                                            type: ['string', 'null'],
                                        },
                                        roles: {
                                            type: 'array',
                                            items: { type: 'string' },
                                        },
                                        unusual_dm_activity_until: {
                                            type: ['string', 'null'],
                                        },
                                        user: {
                                            type: 'object',
                                            properties: {
                                                id: { type: 'string' },
                                                username: { type: 'string' },
                                                avatar: {
                                                    type: ['string', 'null'],
                                                },
                                                discriminator: {
                                                    type: 'string',
                                                },
                                                public_flags: {
                                                    type: 'integer',
                                                },
                                                flags: { type: 'integer' },
                                                banner: {
                                                    type: ['string', 'null'],
                                                },
                                                accent_color: {
                                                    type: 'integer',
                                                },
                                                global_name: { type: 'string' },
                                                avatar_decoration_data: {
                                                    type: 'object',
                                                    properties: {
                                                        asset: {
                                                            type: 'string',
                                                        },
                                                        sku_id: {
                                                            type: 'string',
                                                        },
                                                        expires_at: {
                                                            type: [
                                                                'string',
                                                                'null',
                                                            ],
                                                        },
                                                    },
                                                },
                                                banner_color: {
                                                    type: ['string', 'null'],
                                                },
                                                clan: {
                                                    type: ['string', 'null'],
                                                },
                                            },
                                            required: [
                                                'id',
                                                'username',
                                                'discriminator',
                                                'public_flags',
                                                'flags',
                                                'global_name',
                                            ],
                                        },
                                        mute: { type: 'boolean' },
                                        deaf: { type: 'boolean' },
                                        bio: { type: 'string' },
                                    },
                                    required: [
                                        'avatar',
                                        'banner',
                                        'flags',
                                        'joined_at',
                                        'nick',
                                        'pending',
                                        'roles',
                                        'user',
                                        'mute',
                                        'deaf',
                                        'bio',
                                    ],
                                },
                                example: {
                                    avatar: null,
                                    banner: null,
                                    communication_disabled_until: null,
                                    flags: 2,
                                    joined_at:
                                        '2021-05-01T10:00:19.894000+00:00',
                                    nick: '[Founder] bread take',
                                    pending: false,
                                    premium_since: null,
                                    roles: [
                                        '867824672845201409',
                                        '870636122756243496',
                                        '1051828712104013864',
                                        '803193916517384202',
                                        '867824700015902730',
                                        '867824807797194764',
                                        '867824826621231114',
                                        '1106006742875262987',
                                        '917472697892601906',
                                        '1106007520234983444',
                                        '867824631032840213',
                                        '1055520403822481558',
                                        '870637493211508796',
                                        '1048199772814704671',
                                    ],
                                    unusual_dm_activity_until: null,
                                    user: {
                                        id: '778685361014046780',
                                        username: 'breftejk',
                                        avatar: '7d0696b02bdc3062aaac12eefd910eea',
                                        discriminator: '0',
                                        public_flags: 4194368,
                                        flags: 4194368,
                                        banner: null,
                                        accent_color: 16639,
                                        global_name: 'breadtake',
                                        avatar_decoration_data: {
                                            asset: 'a_911e48f3a695c7f6c267843ab6a96f2f',
                                            sku_id: '1144056139584127058',
                                            expires_at: null,
                                        },
                                        banner_color: '#0040ff',
                                        clan: null,
                                    },
                                    mute: false,
                                    deaf: false,
                                    bio: '',
                                },
                            },
                        },
                    },
                    401: responsesSchema['401'],
                    403: responsesSchema['403'],
                },
            },
            preHandler: authMiddleware,
        },
        async (
            request: FastifyRequest<{
                Params: {
                    guild_id: string;
                };
            }>,
            reply,
        ): Promise<GuildMember> => {
            const { guild_id } = request.params;

            const guildMember = await fetchGuildDetails(
                guild_id,
                request.session.tokens!.access_token,
            );
            return reply.send(guildMember);
        },
    );

    done();
};

export default fp(GuildsRoute, {
    name: 'Guilds route',
});
