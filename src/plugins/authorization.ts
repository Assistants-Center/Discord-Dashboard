import type { FastifyPluginAsync } from 'fastify';

import type { User } from '@discord-dashboard/typings/dist/User';
import type { Config } from '@discord-dashboard/typings/dist/Config';

import fp from 'fastify-plugin';

import FastifyCookie from '@fastify/cookie';
import FastifySession, { SessionStore } from '@fastify/session';

import DiscordOauth2 from 'discord-oauth2';

declare module 'fastify' {
    interface Session {
        user?: User;
        tokens?: DiscordOauth2.TokenRequestResult;
    }
}

const AuthorizationPlugin: FastifyPluginAsync<{
    api_config: Config['api'];
    store: SessionStore;
}> = async (fastify, opts) => {
    await fastify.register(FastifyCookie);
    await fastify.register(FastifySession, {
        secret: opts.api_config.session.secret,
        cookie: {
            secure: opts.api_config.protocol === 'https',
        },
        store: opts.store,
    });
};

export default fp(AuthorizationPlugin, {
    name: 'authorization',
});
