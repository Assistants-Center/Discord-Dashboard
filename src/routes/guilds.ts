import { FastifyPluginCallback, type FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';

import { PermissionsBitField } from 'discord.js';

import { Config } from '@discord-dashboard/typings/dist/Config';

import type {
    GuildMember,
    GuildResponse,
} from '@discord-dashboard/typings/dist/Core/Guilds';
import fetchWithCache from '../wrappers/cache-wrapper';

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
    fastify.get(opts.prefix, async (request, reply) => {
        if (!request.session.tokens) throw new Error('No token provided');

        const guilds = await fetchUserGuilds(
            request.session.tokens.access_token,
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
    });

    fastify.get(
        `${opts.prefix}/:guild_id/member`,
        async (
            request: FastifyRequest<{
                Params: {
                    guild_id: string;
                };
            }>,
            reply,
        ): Promise<GuildMember> => {
            if (!request.session.user) return reply.redirect('/api/auth');
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
