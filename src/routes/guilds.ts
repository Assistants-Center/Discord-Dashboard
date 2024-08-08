import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';

import { PermissionsBitField } from 'discord.js';

import axios from 'axios';
import { Config } from '@discord-dashboard/typings/dist/Config';

import type { GuildResponse } from '@discord-dashboard/typings/dist/Core/Guilds';

const fetchUserGuilds = async (
    accessToken: string,
): Promise<GuildResponse[]> => {
    try {
        const url = 'https://discord.com/api/v10/users/@me/guilds';

        const response = await axios.get<GuildResponse[]>(url, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching user guilds:', error);
        throw error;
    }
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
                        guild.permissions,
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

    done();
};

export default fp(GuildsRoute, {
    name: 'Guilds route',
});
