import type { FastifyPluginAsync } from 'fastify';

import fp from 'fastify-plugin';

import DiscordOauth2 from 'discord-oauth2';

const RefreshTokenPlugin: FastifyPluginAsync<{
    clientId: string;
    clientSecret: string;
}> = async (fastify, opts) => {
    const oauth2 = new DiscordOauth2({
        clientId: opts.clientId,
        clientSecret: opts.clientSecret,
    });

    const refreshToken = async (refreshToken: string) => {
        try {
            return await oauth2.tokenRequest({
                grantType: 'refresh_token',
                refreshToken,
                scope: 'identify email',
            });
        } catch (error) {
            fastify.log.error('Error refreshing access token:', error);
            throw new Error('Failed to refresh token');
        }
    };

    fastify.addHook('preHandler', async (request, reply) => {
        if (!request.session.tokens || !request.session.user) {
            return;
        }

        const { refresh_token, expires_in } = request.session.tokens;

        const currentTime = new Date();
        const expirationTime = new Date(
            currentTime.getTime() + expires_in * 1000,
        );

        if (expirationTime.getTime() - currentTime.getTime() <= 5 * 60 * 1000) {
            try {
                const newTokens = await refreshToken(refresh_token);

                request.session.tokens = newTokens;
                request.session.user = await oauth2.getUser(
                    newTokens.access_token,
                );

                await request.session.save();
            } catch (error) {
                request.session.tokens = undefined;
                request.session.user = undefined;

                await request.session.save();

                return reply.redirect('/api/auth');
            }
        }
    });
};

export default fp(RefreshTokenPlugin, {
    name: 'refresh-token',
});
