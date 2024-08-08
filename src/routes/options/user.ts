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

const UserOptionsRoute: FastifyPluginCallback<{
    options: UserFormOptionGroup[];
    prefix: string;
}> = (fastify, opts, done) => {
    fastify.get(
        `${opts.prefix}`,
        async (request, reply): Promise<GroupResponse[]> => {
            if (!request.session.user) return reply.redirect('/api/auth');
            const user_id = request.session.user.id;

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
                    (option) => option !== null,
                );

                return group_data;
            });

            data.push(
                ...(await Promise.all(groupPromises)).filter(
                    (group) => group !== null,
                ),
            );

            return data;
        },
    );

    fastify.post(
        `${opts.prefix}`,
        async (
            request: FastifyRequest<{
                Body: GroupUpdateRequest[];
            }>,
            reply: FastifyReply,
        ): Promise<{ [key: string]: any }> => {
            if (!request.session.user) return reply.redirect('/api/auth');
            const user_id = request.session.user.id;
            const updateData = request.body;

            const errorResults: { [key: string]: any } = {};

            const groupPromises = updateData.map(async (groupUpdate) => {
                const group = opts.options.find((g) => g.id === groupUpdate.id);
                if (!group)
                    throw new Error(
                        `Group with id ${groupUpdate.id} not found`,
                    );

                const hasAccessToGroup = await group.canAccess(user_id);
                if (!hasAccessToGroup.allowed)
                    throw new Error(hasAccessToGroup.error.message);

                const optionPromises = groupUpdate.options.map(
                    async (optionUpdate) => {
                        const option = group.options.find(
                            (o) => o.id === optionUpdate.id,
                        );
                        if (!option)
                            throw new Error(
                                `Option with id ${optionUpdate.id} not found`,
                            );

                        if (!hasAccessToGroup.allowed)
                            throw new Error(`NOT_ALLOWED_GROUP_DISALLOWED`);

                        const hasAccess = await option.canAccess(user_id);
                        if (!hasAccess.allowed)
                            throw new Error(hasAccess.error.message);

                        try {
                            await option.set(user_id, optionUpdate.value);
                        } catch (error) {
                            return { id: option.id, error };
                        }
                    },
                );

                const optionResults = await Promise.allSettled(optionPromises);
                const optionErrors = optionResults.filter(
                    (result) => result.status === 'rejected',
                );

                if (optionErrors.length > 0) {
                    errorResults[group.id] = optionErrors.map((error) => ({
                        id: error.reason.id,
                        error: error.reason.error,
                    }));
                }
            });

            const groupResults = await Promise.allSettled(groupPromises);
            const groupErrors = groupResults.filter(
                (result) => result.status === 'rejected',
            );

            groupErrors.forEach((error, index) => {
                const groupId = updateData[index].id;
                errorResults[groupId] = errorResults[groupId] || [];
                errorResults[groupId].push({ error: error.reason });
            });

            return errorResults;
        },
    );

    done();
};

export default fp(UserOptionsRoute, {
    name: 'User options route',
});
