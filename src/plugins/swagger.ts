import { FastifyPluginAsync, FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';

import PackageInfo from '../../package.json';

import FastifySwagger from '@fastify/swagger';
import FastifySwaggerUI from '@fastify/swagger-ui';
import path from 'node:path';
import * as fs from 'node:fs';

const SwaggerPlugin: FastifyPluginAsync = async (fastify, opts) => {
    await fastify.register(FastifySwagger, {
        openapi: {
            openapi: '3.0.0',
            info: {
                title: '@Discord-Dashboard/Core',
                description: "This is the module instance's documentation.",
                version: PackageInfo.version,
            },
            servers: [
                {
                    url: 'http://localhost:3000',
                    description: 'Discord-Dashboard Instance',
                },
            ],
            tags: [
                { name: 'core', description: 'Core related end-points' },
                { name: 'default', description: 'Uncategorized end-points' },
            ],
            externalDocs: {
                url: 'https://docs.assts.tech/discord-dashboard',
                description: 'Interested in the module documentation?',
            },
        },
    });

    await fastify.register(FastifySwaggerUI, {
        logo: {
            type: 'image/png',
            content: fs.readFileSync(
                path.resolve(__dirname, '../../resources/Assistants_NoBG.png'),
            ),
        },
        routePrefix: '/documentation',
    });
};

export default fp(SwaggerPlugin, {
    name: 'swagger',
});
