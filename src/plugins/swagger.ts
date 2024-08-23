import { FastifyPluginAsync, FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';

import PackageInfo from '../../package.json';

import FastifySwagger from '@fastify/swagger';
import FastifySwaggerUI from '@fastify/swagger-ui';
import path from 'node:path';
import * as fs from 'node:fs';
import ErrorCodes from '@discord-dashboard/typings/dist/Core/ErrorCodes';

const SwaggerPlugin: FastifyPluginAsync<{
    theme_name: string;
    theme_version: string;
}> = async (fastify, opts) => {
    await fastify.register(FastifySwagger, {
        openapi: {
            openapi: '3.0.0',
            info: {
                title: '@Discord-Dashboard/Core',
                description: "This is the module instance's documentation.",
                version: `v${PackageInfo.version} with ${opts.theme_name} v${opts.theme_version}`,
            },
            servers: [
                {
                    url: 'http://localhost:3000',
                    description: 'Discord-Dashboard Instance',
                },
            ],
            tags: [
                { name: 'core', description: 'Core related end-points' },
                {
                    name: 'theme',
                    description: `${opts.theme_name} theme related end-points`,
                },
                { name: 'default', description: 'Uncategorized end-points' },
            ],
            externalDocs: {
                url: 'https://docs.assts.tech/discord-dashboard',
                description: 'Interested in the module documentation?',
            },
            components: {
                securitySchemes: {
                    sessionId: {
                        type: 'apiKey',
                        in: 'cookie',
                        name: 'sessionId',
                        description:
                            'The session ID cookie used for authentication',
                    },
                },
            },
        },
    });

    await fastify.register(FastifySwaggerUI, {
        logo: {
            type: 'image/svg+xml',
            content: fs.readFileSync(
                path.resolve(__dirname, '../../resources/Logo.svg'),
            ),
        },
        routePrefix: '/documentation',
    });
};

const responsesSchema = {
    '400': {
        description: 'BadRequest',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        statusCode: {
                            type: 'integer',
                        },
                        code: {
                            type: 'string',
                        },
                        error: {
                            type: 'string',
                        },
                        message: {
                            type: 'string',
                        },
                    },
                },
                example: {
                    statusCode: 400,
                    code: ErrorCodes.BAD_REQUEST,
                    error: 'BadRequest',
                    message: 'BadRequest',
                },
            },
        },
    },
    '401': {
        description: 'Unauthorized',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        statusCode: {
                            type: 'integer',
                        },
                        code: {
                            type: 'string',
                        },
                        error: {
                            type: 'string',
                        },
                        message: {
                            type: 'string',
                        },
                    },
                },
                example: {
                    statusCode: 401,
                    code: ErrorCodes.UNAUTHORIZED,
                    error: 'Unauthorized',
                    message: 'Unauthorized',
                },
            },
        },
    },
    '402': {
        description: 'PaymentRequired',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        statusCode: {
                            type: 'integer',
                        },
                        code: {
                            type: 'string',
                        },
                        error: {
                            type: 'string',
                        },
                        message: {
                            type: 'string',
                        },
                    },
                },
                example: {
                    statusCode: 402,
                    code: ErrorCodes.PAYMENT_REQUIRED,
                    error: 'PaymentRequired',
                    message: 'PaymentRequired',
                },
            },
        },
    },
    '403': {
        description: 'Forbidden',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        statusCode: {
                            type: 'integer',
                        },
                        code: {
                            type: 'string',
                        },
                        error: {
                            type: 'string',
                        },
                        message: {
                            type: 'string',
                        },
                    },
                },
                example: {
                    statusCode: 403,
                    code: ErrorCodes.FORBIDDEN,
                    error: 'Forbidden',
                    message: 'Forbidden',
                },
            },
        },
    },
    '404': {
        description: 'NotFound',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        statusCode: {
                            type: 'integer',
                        },
                        code: {
                            type: 'string',
                        },
                        error: {
                            type: 'string',
                        },
                        message: {
                            type: 'string',
                        },
                    },
                },
                example: {
                    statusCode: 404,
                    code: ErrorCodes.NOT_FOUND,
                    error: 'NotFound',
                    message: 'NotFound',
                },
            },
        },
    },
    '405': {
        description: 'MethodNotAllowed',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        statusCode: {
                            type: 'integer',
                        },
                        code: {
                            type: 'string',
                        },
                        error: {
                            type: 'string',
                        },
                        message: {
                            type: 'string',
                        },
                    },
                },
                example: {
                    statusCode: 405,
                    code: ErrorCodes.METHOD_NOT_ALLOWED,
                    error: 'MethodNotAllowed',
                    message: 'MethodNotAllowed',
                },
            },
        },
    },
    '406': {
        description: 'NotAcceptable',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        statusCode: {
                            type: 'integer',
                        },
                        code: {
                            type: 'string',
                        },
                        error: {
                            type: 'string',
                        },
                        message: {
                            type: 'string',
                        },
                    },
                },
                example: {
                    statusCode: 406,
                    code: ErrorCodes.NOT_ACCEPTABLE,
                    error: 'NotAcceptable',
                    message: 'NotAcceptable',
                },
            },
        },
    },
    '407': {
        description: 'ProxyAuthenticationRequired',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        statusCode: {
                            type: 'integer',
                        },
                        code: {
                            type: 'string',
                        },
                        error: {
                            type: 'string',
                        },
                        message: {
                            type: 'string',
                        },
                    },
                },
                example: {
                    statusCode: 407,
                    code: ErrorCodes.PROXY_AUTHENTICATION_REQUIRED,
                    error: 'ProxyAuthenticationRequired',
                    message: 'ProxyAuthenticationRequired',
                },
            },
        },
    },
    '408': {
        description: 'RequestTimeout',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        statusCode: {
                            type: 'integer',
                        },
                        code: {
                            type: 'string',
                        },
                        error: {
                            type: 'string',
                        },
                        message: {
                            type: 'string',
                        },
                    },
                },
                example: {
                    statusCode: 408,
                    code: ErrorCodes.REQUEST_TIMEOUT,
                    error: 'RequestTimeout',
                    message: 'RequestTimeout',
                },
            },
        },
    },
    '409': {
        description: 'Conflict',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        statusCode: {
                            type: 'integer',
                        },
                        code: {
                            type: 'string',
                        },
                        error: {
                            type: 'string',
                        },
                        message: {
                            type: 'string',
                        },
                    },
                },
                example: {
                    statusCode: 409,
                    code: ErrorCodes.CONFLICT,
                    error: 'Conflict',
                    message: 'Conflict',
                },
            },
        },
    },
    '410': {
        description: 'Gone',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        statusCode: {
                            type: 'integer',
                        },
                        code: {
                            type: 'string',
                        },
                        error: {
                            type: 'string',
                        },
                        message: {
                            type: 'string',
                        },
                    },
                },
                example: {
                    statusCode: 410,
                    code: ErrorCodes.GONE,
                    error: 'Gone',
                    message: 'Gone',
                },
            },
        },
    },
    '411': {
        description: 'LengthRequired',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        statusCode: {
                            type: 'integer',
                        },
                        code: {
                            type: 'string',
                        },
                        error: {
                            type: 'string',
                        },
                        message: {
                            type: 'string',
                        },
                    },
                },
                example: {
                    statusCode: 411,
                    code: ErrorCodes.LENGTH_REQUIRED,
                    error: 'LengthRequired',
                    message: 'LengthRequired',
                },
            },
        },
    },
    '412': {
        description: 'PreconditionFailed',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        statusCode: {
                            type: 'integer',
                        },
                        code: {
                            type: 'string',
                        },
                        error: {
                            type: 'string',
                        },
                        message: {
                            type: 'string',
                        },
                    },
                },
                example: {
                    statusCode: 412,
                    code: ErrorCodes.PRECONDITION_REQUIRED,
                    error: 'PreconditionFailed',
                    message: 'PreconditionFailed',
                },
            },
        },
    },
    '413': {
        description: 'PayloadTooLarge',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        statusCode: {
                            type: 'integer',
                        },
                        code: {
                            type: 'string',
                        },
                        error: {
                            type: 'string',
                        },
                        message: {
                            type: 'string',
                        },
                    },
                },
                example: {
                    statusCode: 413,
                    code: ErrorCodes.PAYLOAD_TOO_LARGE,
                    error: 'PayloadTooLarge',
                    message: 'PayloadTooLarge',
                },
            },
        },
    },
    '414': {
        description: 'URITooLong',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        statusCode: {
                            type: 'integer',
                        },
                        code: {
                            type: 'string',
                        },
                        error: {
                            type: 'string',
                        },
                        message: {
                            type: 'string',
                        },
                    },
                },
                example: {
                    statusCode: 414,
                    code: ErrorCodes.URI_TOO_LONG,
                    error: 'URITooLong',
                    message: 'URITooLong',
                },
            },
        },
    },
    '415': {
        description: 'UnsupportedMediaType',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        statusCode: {
                            type: 'integer',
                        },
                        code: {
                            type: 'string',
                        },
                        error: {
                            type: 'string',
                        },
                        message: {
                            type: 'string',
                        },
                    },
                },
                example: {
                    statusCode: 415,
                    code: ErrorCodes.UNSUPPORTED_MEDIA_TYPE,
                    error: 'UnsupportedMediaType',
                    message: 'UnsupportedMediaType',
                },
            },
        },
    },
    '416': {
        description: 'RangeNotSatisfiable',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        statusCode: {
                            type: 'integer',
                        },
                        code: {
                            type: 'string',
                        },
                        error: {
                            type: 'string',
                        },
                        message: {
                            type: 'string',
                        },
                    },
                },
                example: {
                    statusCode: 416,
                    code: ErrorCodes.RANGE_NOT_SATISFIABLE,
                    error: 'RangeNotSatisfiable',
                    message: 'RangeNotSatisfiable',
                },
            },
        },
    },
    '417': {
        description: 'ExpectationFailed',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        statusCode: {
                            type: 'integer',
                        },
                        code: {
                            type: 'string',
                        },
                        error: {
                            type: 'string',
                        },
                        message: {
                            type: 'string',
                        },
                    },
                },
                example: {
                    statusCode: 417,
                    code: ErrorCodes.EXPECTATION_FAILED,
                    error: 'ExpectationFailed',
                    message: 'ExpectationFailed',
                },
            },
        },
    },
    '421': {
        description: 'MisdirectedRequest',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        statusCode: {
                            type: 'integer',
                        },
                        code: {
                            type: 'string',
                        },
                        error: {
                            type: 'string',
                        },
                        message: {
                            type: 'string',
                        },
                    },
                },
                example: {
                    statusCode: 421,
                    code: ErrorCodes.MISDIRECTED_REQUEST,
                    error: 'MisdirectedRequest',
                    message: 'MisdirectedRequest',
                },
            },
        },
    },
    '422': {
        description: 'UnprocessableEntity',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        statusCode: {
                            type: 'integer',
                        },
                        code: {
                            type: 'string',
                        },
                        error: {
                            type: 'string',
                        },
                        message: {
                            type: 'string',
                        },
                    },
                },
                example: {
                    statusCode: 422,
                    code: ErrorCodes.UNPROCESSABLE_ENTITY,
                    error: 'UnprocessableEntity',
                    message: 'UnprocessableEntity',
                },
            },
        },
    },
    '423': {
        description: 'Locked',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        statusCode: {
                            type: 'integer',
                        },
                        code: {
                            type: 'string',
                        },
                        error: {
                            type: 'string',
                        },
                        message: {
                            type: 'string',
                        },
                    },
                },
                example: {
                    statusCode: 423,
                    code: ErrorCodes.LOCKED,
                    error: 'Locked',
                    message: 'Locked',
                },
            },
        },
    },
    '424': {
        description: 'FailedDependency',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        statusCode: {
                            type: 'integer',
                        },
                        code: {
                            type: 'string',
                        },
                        error: {
                            type: 'string',
                        },
                        message: {
                            type: 'string',
                        },
                    },
                },
                example: {
                    statusCode: 424,
                    code: ErrorCodes.FAILED_DEPENDENCY,
                    error: 'FailedDependency',
                    message: 'FailedDependency',
                },
            },
        },
    },
    '425': {
        description: 'UnorderedCollection',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        statusCode: {
                            type: 'integer',
                        },
                        code: {
                            type: 'string',
                        },
                        error: {
                            type: 'string',
                        },
                        message: {
                            type: 'string',
                        },
                    },
                },
                example: {
                    statusCode: 425,
                    code: ErrorCodes.UNORDERED_COLLECTION,
                    error: 'UnorderedCollection',
                    message: 'UnorderedCollection',
                },
            },
        },
    },
    '426': {
        description: 'UpgradeRequired',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        statusCode: {
                            type: 'integer',
                        },
                        code: {
                            type: 'string',
                        },
                        error: {
                            type: 'string',
                        },
                        message: {
                            type: 'string',
                        },
                    },
                },
                example: {
                    statusCode: 426,
                    code: ErrorCodes.UPGRADE_REQUIRED,
                    error: 'UpgradeRequired',
                    message: 'UpgradeRequired',
                },
            },
        },
    },
    '428': {
        description: 'PreconditionRequired',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        statusCode: {
                            type: 'integer',
                        },
                        code: {
                            type: 'string',
                        },
                        error: {
                            type: 'string',
                        },
                        message: {
                            type: 'string',
                        },
                    },
                },
                example: {
                    statusCode: 428,
                    code: ErrorCodes.PRECONDITION_REQUIRED,
                    error: 'PreconditionRequired',
                    message: 'PreconditionRequired',
                },
            },
        },
    },
    '429': {
        description: 'TooManyRequests',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        statusCode: {
                            type: 'integer',
                        },
                        code: {
                            type: 'string',
                        },
                        error: {
                            type: 'string',
                        },
                        message: {
                            type: 'string',
                        },
                    },
                },
                example: {
                    statusCode: 429,
                    code: ErrorCodes.TOO_MANY_REQUESTS,
                    error: 'TooManyRequests',
                    message: 'TooManyRequests',
                },
            },
        },
    },
    '431': {
        description: 'UnavailableForLegalReasons',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        statusCode: {
                            type: 'integer',
                        },
                        code: {
                            type: 'string',
                        },
                        error: {
                            type: 'string',
                        },
                        message: {
                            type: 'string',
                        },
                    },
                },
                example: {
                    statusCode: 431,
                    code: ErrorCodes.UNAVAILABLE_FOR_LEGAL_REASONS,
                    error: 'UnavailableForLegalReasons',
                    message: 'UnavailableForLegalReasons',
                },
            },
        },
    },
    '451': {
        description: 'RequestHeaderFieldsTooLarge',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        statusCode: {
                            type: 'integer',
                        },
                        code: {
                            type: 'string',
                        },
                        error: {
                            type: 'string',
                        },
                        message: {
                            type: 'string',
                        },
                    },
                },
                example: {
                    statusCode: 451,
                    code: ErrorCodes.REQUEST_HEADER_FIELDS_TOO_LARGE,
                    error: 'RequestHeaderFieldsTooLarge',
                    message: 'RequestHeaderFieldsTooLarge',
                },
            },
        },
    },
    '500': {
        description: 'InternalServerError',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        statusCode: {
                            type: 'integer',
                        },
                        code: {
                            type: 'string',
                        },
                        error: {
                            type: 'string',
                        },
                        message: {
                            type: 'string',
                        },
                    },
                },
                example: {
                    statusCode: 500,
                    code: ErrorCodes.INTERNAL_SERVER_ERROR,
                    error: 'InternalServerError',
                    message: 'InternalServerError',
                },
            },
        },
    },
    '501': {
        description: 'NotImplemented',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        statusCode: {
                            type: 'integer',
                        },
                        code: {
                            type: 'string',
                        },
                        error: {
                            type: 'string',
                        },
                        message: {
                            type: 'string',
                        },
                    },
                },
                example: {
                    statusCode: 501,
                    code: ErrorCodes.NOT_IMPLEMENTED,
                    error: 'NotImplemented',
                    message: 'NotImplemented',
                },
            },
        },
    },
    '502': {
        description: 'BadGateway',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        statusCode: {
                            type: 'integer',
                        },
                        code: {
                            type: 'string',
                        },
                        error: {
                            type: 'string',
                        },
                        message: {
                            type: 'string',
                        },
                    },
                },
                example: {
                    statusCode: 502,
                    code: ErrorCodes.BAD_GATEWAY,
                    error: 'BadGateway',
                    message: 'BadGateway',
                },
            },
        },
    },
    '503': {
        description: 'ServiceUnavailable',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        statusCode: {
                            type: 'integer',
                        },
                        code: {
                            type: 'string',
                        },
                        error: {
                            type: 'string',
                        },
                        message: {
                            type: 'string',
                        },
                    },
                },
                example: {
                    statusCode: 503,
                    code: ErrorCodes.SERVICE_UNAVAILABLE,
                    error: 'ServiceUnavailable',
                    message: 'ServiceUnavailable',
                },
            },
        },
    },
    '504': {
        description: 'GatewayTimeout',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        statusCode: {
                            type: 'integer',
                        },
                        code: {
                            type: 'string',
                        },
                        error: {
                            type: 'string',
                        },
                        message: {
                            type: 'string',
                        },
                    },
                },
                example: {
                    statusCode: 504,
                    code: ErrorCodes.GATEWAY_TIMEOUT,
                    error: 'GatewayTimeout',
                    message: 'GatewayTimeout',
                },
            },
        },
    },
    '505': {
        description: 'HTTPVersionNotSupported',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        statusCode: {
                            type: 'integer',
                        },
                        code: {
                            type: 'string',
                        },
                        error: {
                            type: 'string',
                        },
                        message: {
                            type: 'string',
                        },
                    },
                },
                example: {
                    statusCode: 505,
                    code: ErrorCodes.HTTP_VERSION_NOT_SUPPORTED,
                    error: 'HTTPVersionNotSupported',
                    message: 'HTTPVersionNotSupported',
                },
            },
        },
    },
    '506': {
        description: 'VariantAlsoNegotiates',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        statusCode: {
                            type: 'integer',
                        },
                        code: {
                            type: 'string',
                        },
                        error: {
                            type: 'string',
                        },
                        message: {
                            type: 'string',
                        },
                    },
                },
                example: {
                    statusCode: 506,
                    code: ErrorCodes.VARIANT_ALSO_NEGOTIATES,
                    error: 'VariantAlsoNegotiates',
                    message: 'VariantAlsoNegotiates',
                },
            },
        },
    },
    '507': {
        description: 'InsufficientStorage',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        statusCode: {
                            type: 'integer',
                        },
                        code: {
                            type: 'string',
                        },
                        error: {
                            type: 'string',
                        },
                        message: {
                            type: 'string',
                        },
                    },
                },
                example: {
                    statusCode: 507,
                    code: ErrorCodes.INSUFFICIENT_STORAGE,
                    error: 'InsufficientStorage',
                    message: 'InsufficientStorage',
                },
            },
        },
    },
    '508': {
        description: 'LoopDetected',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        statusCode: {
                            type: 'integer',
                        },
                        code: {
                            type: 'string',
                        },
                        error: {
                            type: 'string',
                        },
                        message: {
                            type: 'string',
                        },
                    },
                },
                example: {
                    statusCode: 508,
                    code: ErrorCodes.LOOP_DETECTED,
                    error: 'LoopDetected',
                    message: 'LoopDetected',
                },
            },
        },
    },
    '510': {
        description: 'NotExtended',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        statusCode: {
                            type: 'integer',
                        },
                        code: {
                            type: 'string',
                        },
                        error: {
                            type: 'string',
                        },
                        message: {
                            type: 'string',
                        },
                    },
                },
                example: {
                    statusCode: 510,
                    code: ErrorCodes.NOT_EXTENDED,
                    error: 'NotExtended',
                    message: 'NotExtended',
                },
            },
        },
    },
    '511': {
        description: 'NetworkAuthenticationRequired',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        statusCode: {
                            type: 'integer',
                        },
                        code: {
                            type: 'string',
                        },
                        error: {
                            type: 'string',
                        },
                        message: {
                            type: 'string',
                        },
                    },
                },
                example: {
                    statusCode: 511,
                    code: ErrorCodes.NETWORK_AUTHENTICATION_REQUIRED,
                    error: 'NetworkAuthenticationRequired',
                    message: 'NetworkAuthenticationRequired',
                },
            },
        },
    },
};

export default fp(SwaggerPlugin, {
    name: 'swagger',
});

export { responsesSchema };
