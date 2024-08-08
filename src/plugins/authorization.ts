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
    session: Config['api']['session'];
    store: SessionStore;
}> = async (fastify, opts) => {
    await fastify.register(FastifyCookie);
    await fastify.register(FastifySession, {
        ...opts.session,
        store: opts.store,
    });
};

export default fp(AuthorizationPlugin, {
    name: 'authorization',
});
