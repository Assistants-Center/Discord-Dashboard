import { FastifyPluginAsync, FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';

import FastifySwagger from '@fastify/swagger';
import FastifySwaggerUI from '@fastify/swagger-ui';

const SwaggerPlugin: FastifyPluginAsync = async (fastify, opts) => {
    await fastify.register(FastifySwagger, {
        openapi: {
            openapi: '3.0.0',
            info: {
                title: 'Test swagger',
                description: 'Testing the Fastify swagger API',
                version: '0.1.0',
            },
            servers: [
                {
                    url: 'http://localhost:3000',
                    description: 'Development server',
                },
            ],
            tags: [
                { name: 'user', description: 'User related end-points' },
                { name: 'code', description: 'Code related end-points' },
            ],
            components: {
                securitySchemes: {
                    apiKey: {
                        type: 'apiKey',
                        name: 'apiKey',
                        in: 'header',
                    },
                },
            },
            externalDocs: {
                url: 'https://swagger.io',
                description: 'Find more info here',
            },
        },
    });

    await fastify.register(FastifySwaggerUI, {
        routePrefix: '/documentation',
    });
};

export default fp(SwaggerPlugin, {
    name: 'swagger',
});
