import fp from 'fastify-plugin';

import type {
    FastifyPluginCallback,
    FastifyReply,
    FastifyRequest,
} from 'fastify';
import type { UserFormOptionGroup } from '@discord-dashboard/typings/dist/FormOptions/FormGroup';
import type {
    GroupResponse,
    GroupUpdateRequest,
    OptionResponse,
} from '@discord-dashboard/typings/dist/Core/Options';
import { authMiddleware } from '../../plugins/authorization';
import { responsesSchema } from '../../plugins/swagger';

const UserOptionsRoute: FastifyPluginCallback<{
    options: UserFormOptionGroup[];
    prefix: string;
}> = (fastify, opts, done) => {
    fastify.get(
        `${opts.prefix}`,
        {
            schema: {
                security: [{ sessionId: [] }],
                tags: ['core'],
                response: {
                    200: {
                        description:
                            'Success response with group and option data',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            id: {
                                                type: 'string',
                                                description: 'Group ID',
                                            },
                                            meta: {
                                                type: 'object',
                                                additionalProperties: {
                                                    type: [
                                                        'string',
                                                        'number',
                                                        'boolean',
                                                        'object',
                                                        'array',
                                                    ], // Acceptable types for values
                                                },
                                                description:
                                                    'Metadata for the group',
                                            },
                                            options: {
                                                type: 'array',
                                                items: {
                                                    type: 'object',
                                                    properties: {
                                                        id: {
                                                            type: 'string',
                                                            description:
                                                                'Option ID',
                                                        },
                                                        type: {
                                                            type: 'string',
                                                            description:
                                                                'Type of the option',
                                                        },
                                                        meta: {
                                                            type: 'object',
                                                            additionalProperties:
                                                                {
                                                                    type: [
                                                                        'string',
                                                                        'number',
                                                                        'boolean',
                                                                        'object',
                                                                        'array',
                                                                    ], // Acceptable types for values
                                                                },
                                                            description:
                                                                'Metadata for the option',
                                                        },
                                                        value: {
                                                            type: 'string',
                                                            description:
                                                                'Value of the option',
                                                        },
                                                        disabled: {
                                                            type: 'object',
                                                            properties: {
                                                                bool: {
                                                                    type: 'boolean',
                                                                    description:
                                                                        'Indicates if the option is disabled',
                                                                },
                                                                message: {
                                                                    type: 'string',
                                                                    description:
                                                                        'Reason why the option is disabled',
                                                                },
                                                            },
                                                            required: ['bool'],
                                                            description:
                                                                'Indicates if the option is disabled with a reason',
                                                        },
                                                    },
                                                    required: [
                                                        'id',
                                                        'type',
                                                        'meta',
                                                        'value',
                                                    ],
                                                },
                                            },
                                        },
                                        required: ['id', 'meta', 'options'],
                                    },
                                },
                                example: [
                                    {
                                        id: 'group1',
                                        meta: {},
                                        options: [
                                            {
                                                id: 'option1',
                                                type: 'TextInput',
                                                meta: {
                                                    core: {},
                                                },
                                                value: 'g!',
                                            },
                                            {
                                                id: 'option2',
                                                type: 'TextInput',
                                                meta: {
                                                    core: {},
                                                },
                                                value: 'e',
                                            },
                                            {
                                                id: 'lol',
                                                type: 'TextInput',
                                                disabled: {
                                                    bool: true,
                                                    message:
                                                        'disallowed but a whole category could also be disallowed.',
                                                },
                                                meta: {
                                                    core: {},
                                                },
                                                value: 'g!',
                                            },
                                        ],
                                    },
                                ],
                            },
                        },
                    },
                    401: responsesSchema['401'],
                },
            },
            preHandler: authMiddleware,
        },
        async (request, reply): Promise<GroupResponse[]> => {
            const user_id = request.session.user!.id;

            const data: GroupResponse[] = [];

            const groupPromises = opts.options.map(async (group) => {
                const hasAccessToGroup = await group.canAccess(user_id);
                if (
                    !hasAccessToGroup.allowed &&
                    !hasAccessToGroup.display_in_api
                ) {
                    return null;
                }

                const group_data: GroupResponse = {
                    id: group.id,
                    meta: group.meta,
                    disabled: hasAccessToGroup.allowed
                        ? undefined
                        : {
                              bool: true,
                              message: hasAccessToGroup.error.message,
                          },
                    options: [],
                };

                const optionPromises = group.options.map(async (option) => {
                    const hasAccess = await option.canAccess(user_id);
                    if (!hasAccess.allowed) {
                        if (!hasAccess.display_in_api) return null;
                        const option_data: OptionResponse<any> = {
                            id: option.id,
                            type: option.type,
                            disabled: {
                                bool: true,
                                message: hasAccess.error.message,
                            },
                            meta: option.meta,
                            value: await option.get(user_id),
                        };

                        if (!hasAccessToGroup.allowed)
                            option_data.disabled = {
                                bool: true,
                                message: 'NOT_ALLOWED_GROUP_DISALLOWED',
                            };

                        return option_data;
                    }

                    const option_data: OptionResponse<any> = {
                        id: option.id,
                        type: option.type,
                        meta: option.meta,
                        value: await option.get(user_id),
                    };

                    return option_data;
                });

                group_data.options = (await Promise.all(optionPromises)).filter(
                    (option): option is OptionResponse<any> => option !== null
                );

                return group_data;
            });

            const results = await Promise.all(groupPromises);

            const filteredGroups = results.filter(
                (group): group is GroupResponse => group !== null
            );

            data.push(...filteredGroups);

            return data;
        },
    );

    fastify.post(
        `${opts.prefix}`,
        {
            preHandler: authMiddleware,
            schema: {
                security: [{ sessionId: [] }],
                tags: ['core'],
                params: {
                    type: 'object',
                    properties: {
                        guild_id: { type: 'string' },
                    },
                    required: ['guild_id'], // Specify that guild_id is required
                },
                body: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string', description: 'Group ID' },
                            options: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        id: { type: 'string', description: 'Option ID' },
                                        value: { type: 'object', description: 'Value to set' },
                                    },
                                    required: ['id', 'value'], // Required fields
                                },
                            },
                        },
                        required: ['id', 'options'], // Required fields
                    },
                },
                response: {
                    200: {
                        type: 'object',
                        additionalProperties: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    id: { type: 'string', description: 'Optional ID of the option that caused the error' },
                                    error: { type: 'string', description: 'Error message' },
                                },
                            },
                        },
                    },
                },
            },
        },
        async (
            request: FastifyRequest<{
                Body: GroupUpdateRequest[];
            }>,
            reply: FastifyReply,
        ): Promise<{ [key: string]: any }> => {
            interface OptionUpdate {
                id: string;        // Option ID
                value: any;       // Value to be set
            }

            interface GroupUpdate {
                id: string;       // Group ID
                options: OptionUpdate[]; // Array of options to update
            }

            interface ErrorResponse {
                id?: string;      // Optional ID of the option that caused the error
                error: string;    // Error description
            }

            interface ErrorResults {
                [groupId: string]: ErrorResponse[]; // Key is group ID, value is an array of errors
            }

// Main function
            const user_id = request.session.user!.id;
            const updateData: GroupUpdate[] = request.body; // Typing request body

            const errorResults: ErrorResults = {}; // Change type

            const groupPromises = updateData.map(async (groupUpdate) => {
                const group = opts.options.find((g) => g.id === groupUpdate.id);
                if (!group) {
                    throw new Error(`Group with id ${groupUpdate.id} not found`);
                }

                const hasAccessToGroup = await group.canAccess(user_id);
                if (!hasAccessToGroup.allowed) {
                    throw new Error(hasAccessToGroup.error.message);
                }

                const optionPromises = groupUpdate.options.map(async (optionUpdate) => {
                    const option = group.options.find((o) => o.id === optionUpdate.id);
                    if (!option) {
                        throw new Error(`Option with id ${optionUpdate.id} not found`);
                    }

                    const hasAccess = await option.canAccess(user_id);
                    if (!hasAccess.allowed) {
                        return {
                            id: option.id,
                            error: hasAccess.error.message || "Option is not allowed for you to edit."
                        } as ErrorResponse;
                    }

                    try {
                        const result = await option.set(user_id, optionUpdate.value);
                        if (result.error) {
                            // Return an error if present and the result is unsuccessful
                            return {
                                id: option.id,
                                error: result.message,
                            } as ErrorResponse; // Use 'as' to enforce the type
                        }
                        return null; // If no error, return null
                    } catch (error) {
                        return { id: option.id, error: error instanceof Error ? error.message : String(error) } as ErrorResponse; // Enforce type
                    }
                });

                // Execute all promises and collect results
                const optionResults = await Promise.allSettled(optionPromises);
                const localErrors: ErrorResponse[] = optionResults.flatMap((result) => {
                    if (result.status === 'fulfilled' && result.value) {
                        return result.value; // Return value if fulfilled
                    } else if (result.status === 'rejected') {
                        const reason = result.reason as { id?: string; error: unknown };
                        return [{
                            id: reason.id, // Optional ID
                            error: reason.error instanceof Error ? reason.error.message : String(reason.error),
                        }] as ErrorResponse[];
                    }
                    return []; // Return an empty array
                });

                if (localErrors.length > 0) {
                    errorResults[group.id] = errorResults[group.id] || [];
                    errorResults[group.id].push(...localErrors); // Collecting errors
                }
            });

// Wait for all group updates and handle group-level errors
            const groupResults = await Promise.allSettled(groupPromises);
            const groupErrors = groupResults.filter((result): result is PromiseRejectedResult => result.status === 'rejected');

            groupErrors.forEach((error, index) => {
                const groupId = updateData[index].id;
                errorResults[groupId] = errorResults[groupId] || [];
                errorResults[groupId].push({
                    error: error.reason instanceof Error ? error.reason.message : String(error.reason),
                });
            });

// Return collected error results
            return errorResults;
        },
    );

    done();
};

export default fp(UserOptionsRoute, {
    name: 'User options route',
});
