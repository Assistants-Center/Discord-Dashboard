import type { FastifyPluginAsync } from 'fastify';

import type { User } from '@discord-dashboard/typings/dist/User';
import type { Config } from '@discord-dashboard/typings/dist/Config';

import fp from 'fastify-plugin';

import FastifyCookie from '@fastify/cookie';
import FastifySession from '@fastify/session';

import ConnectMongo from 'connect-mongo';
import DiscordOauth2 from 'discord-oauth2';

declare module 'fastify' {
    interface Session {
        user?: User;
        tokens?: DiscordOauth2.TokenRequestResult;
    }
}

const AuthorizationPlugin: FastifyPluginAsync<{
    session: Config['api']['session'];
}> = async (fastify, opts) => {
    await fastify.register(FastifyCookie);
    await fastify.register(FastifySession, {
        ...opts.session,
        // <TODO feature="Custom Session Store">
        store: ConnectMongo.create({
            mongoUrl: 'mongodb://localhost/dbd-development',
        }),
        // </TODO>
    });
};

export default fp(AuthorizationPlugin, {
    name: 'authorization',
});
