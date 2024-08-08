import { FastifyPluginCallback, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';

import DiscordOauth2 from 'discord-oauth2';

const AuthRoute: FastifyPluginCallback<{
    clientId: string;
    clientSecret: string;
    redirectUri: string;
    prefix: string;
}> = (fastify, opts, done) => {
    const oauth2 = new DiscordOauth2({
        clientId: opts.clientId,
        clientSecret: opts.clientSecret,
        redirectUri: opts.redirectUri,
    });

    fastify.get(`${opts.prefix}`, (request, reply) => {
        const url = oauth2.generateAuthUrl({
            scope: 'identify email',
        });
        reply.redirect(url);
    });

    fastify.get(
        `${opts.prefix}/callback`,
        async (
            request: FastifyRequest<{
                Querystring: {
                    code?: string;
                };
            }>,
            reply,
        ) => {
            const { code } = request.query;
            if (!code) return 'no code returned';

            const tokens = await oauth2.tokenRequest({
                code,
                scope: 'identify email',
                grantType: 'authorization_code',
            });

            request.session.tokens = tokens;
            request.session.user = await oauth2.getUser(tokens.access_token);

            await request.session.save();

            return reply.redirect('/');
        },
    );

    done();
};

export default fp(AuthRoute, {
    name: 'Authorization route',
});
