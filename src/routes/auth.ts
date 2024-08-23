import { FastifyPluginCallback, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';

import DiscordOauth2 from 'discord-oauth2';
import { authMiddleware } from '../plugins/authorization';
import { responsesSchema } from '../plugins/swagger';

import errors from 'throw-http-errors';
import ErrorCodes from '@discord-dashboard/typings/dist/Core/ErrorCodes';

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

    fastify.get(
        `${opts.prefix}`,
        {
            schema: {
                tags: ['core'],
                querystring: {
                    type: 'object',
                    properties: {
                        back: {
                            type: 'string',
                            description:
                                'Optional route to redirect the user after successful login.',
                            default: '/',
                        },
                    },
                    required: [],
                    additionalProperties: false,
                },
                response: {
                    302: {
                        description: 'Redirect to Discord OAuth2',
                        type: 'null',
                    },
                    400: responsesSchema['400'],
                },
            },
        },
        async (
            request: FastifyRequest<{
                Querystring: {
                    back?: string;
                };
            }>,
            reply,
        ) => {
            if (request.query.back) {
                if (!/^\/[a-zA-Z0-9\-_/]*$/.test(request.query.back))
                    throw new errors.BadRequest(
                        'Invalid back path. The path must start with a "/" and contain only valid characters.',
                    );

                request.session.back = request.query.back;
                await request.session.save();
            }
            const url = oauth2.generateAuthUrl({
                scope: 'identify email guilds guilds.members.read',
            });
            return reply.redirect(url, 302);
        },
    );

    fastify.get(
        `${opts.prefix}/callback`,
        {
            schema: {
                tags: ['core'],
                querystring: {
                    type: 'object',
                    properties: {
                        code: {
                            type: 'string',
                            description:
                                'The code returned by Discord after authorization',
                        },
                    },
                    required: ['code'],
                },
                response: {
                    301: {
                        description: 'Redirect to another URL',
                        type: 'null',
                    },
                    400: responsesSchema['400'],
                    401: responsesSchema['401'],
                    404: responsesSchema['404'],
                    500: responsesSchema['500'],
                },
            },
        },
        async (
            request: FastifyRequest<{
                Querystring: {
                    code?: string;
                };
            }>,
            reply,
        ) => {
            const { code } = request.query;

            try {
                const tokens = await oauth2.tokenRequest({
                    code,
                    scope: 'identify email guilds guilds.members.read',
                    grantType: 'authorization_code',
                });

                request.session.tokens = tokens;
                request.session.user = await oauth2.getUser(
                    tokens.access_token,
                );

                const back = request.session.back;

                request.session.back = undefined;
                await request.session.save();

                return reply.redirect(back || '/', 301);
            } catch (error: any) {
                if (error.response?.status === 401)
                    throw new errors.Unauthorized(
                        'Invalid or expired authorization code',
                        ErrorCodes.UNAUTHORIZED,
                    );

                if (error.response?.status === 400)
                    throw new errors.BadRequest(null, ErrorCodes.BAD_REQUEST);

                throw new errors.InternalServerError(
                    null,
                    ErrorCodes.INTERNAL_SERVER_ERROR,
                );
            }
        },
    );

    fastify.get(
        `${opts.prefix}/me`,
        {
            preHandler: authMiddleware,
            schema: {
                security: [{ sessionId: [] }],
                tags: ['core'],
                response: {
                    200: {
                        description: 'Ok',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        id: { type: 'string' },
                                        username: { type: 'string' },
                                        avatar: { type: 'string' },
                                        discriminator: { type: 'string' },
                                        public_flags: { type: 'integer' },
                                        flags: { type: 'integer' },
                                        banner: { type: ['string', 'null'] },
                                        accent_color: { type: 'integer' },
                                        global_name: { type: 'string' },
                                        avatar_decoration_data: {
                                            type: 'object',
                                            properties: {
                                                asset: { type: 'string' },
                                                sku_id: { type: 'string' },
                                                expires_at: {
                                                    type: ['string', 'null'],
                                                },
                                            },
                                        },
                                        banner_color: {
                                            type: ['string', 'null'],
                                        },
                                        clan: { type: ['string', 'null'] },
                                        mfa_enabled: { type: 'boolean' },
                                        locale: { type: 'string' },
                                        premium_type: { type: 'integer' },
                                        email: { type: 'string' },
                                        verified: { type: 'boolean' },
                                    },
                                    required: [
                                        'id',
                                        'username',
                                        'avatar',
                                        'discriminator',
                                        'public_flags',
                                        'flags',
                                        'accent_color',
                                        'global_name',
                                        'avatar_decoration_data',
                                        'mfa_enabled',
                                        'locale',
                                        'premium_type',
                                        'email',
                                        'verified',
                                    ],
                                },
                                example: {
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
                                    mfa_enabled: true,
                                    locale: 'en-US',
                                    premium_type: 0,
                                    email: 'breathtake@assistantscenter.com',
                                    verified: true,
                                },
                            },
                        },
                    },
                    401: responsesSchema['401'],
                },
            },
        },
        (request, reply) => {
            return reply.send(request.session.user);
        },
    );

    done();
};

export default fp(AuthRoute, {
    name: 'Authorization route',
});
