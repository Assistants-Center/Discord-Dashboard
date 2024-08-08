import fp from 'fastify-plugin';

import type {
    FastifyPluginCallback,
    FastifyReply,
    FastifyRequest,
} from 'fastify';

import type { GuildFormOptionGroup } from '@discord-dashboard/typings/dist/FormOptions/FormGroup';
import type {
    GroupResponse,
    GroupUpdateRequest,
    OptionResponse,
} from '@discord-dashboard/typings/dist/Core/Options';

const GuildOptionsRoute: FastifyPluginCallback<{
    options: GuildFormOptionGroup[];
    prefix: string;
}> = (fastify, opts, done) => {
    fastify.get(
        `${opts.prefix}/:guild_id`,
        async (
            request: FastifyRequest<{
                Params: {
                    guild_id: string;
                };
            }>,
            reply,
        ): Promise<GroupResponse[]> => {
            if (!request.session.user) return reply.redirect('/api/auth');
            const user_id = request.session.user.id;
            const { guild_id } = request.params;

            const data: GroupResponse[] = [];

            const groupPromises = opts.options.map(async (group) => {
                const group_data: GroupResponse = {
                    id: group.id,
                    meta: group.meta,
                    options: [],
                };

                const optionPromises = group.options.map(async (option) => {
                    const hasAccess = await option.canAccess(user_id, guild_id);
                    if (!hasAccess) return null;

                    const option_data: OptionResponse<any> = {
                        id: option.id,
                        type: option.type,
                        meta: option.meta,
                        value: await option.get(user_id, guild_id),
                    };

                    return option_data;
                });

                group_data.options = (await Promise.all(optionPromises)).filter(
                    (option) => option !== null,
                );

                return group_data;
            });

            data.push(...(await Promise.all(groupPromises)));

            return data;
        },
    );

    fastify.post(
        `${opts.prefix}/:guild_id`,
        async (
            request: FastifyRequest<{
                Params: {
                    guild_id: string;
                };
                Body: GroupUpdateRequest[];
            }>,
            reply: FastifyReply,
        ): Promise<{ [key: string]: any }> => {
            if (!request.session.user) return reply.redirect('/api/auth');
            const user_id = request.session.user.id;
            const { guild_id } = request.params;
            const updateData = request.body;

            const errorResults: { [key: string]: any } = {};

            const groupPromises = updateData.map(async (groupUpdate) => {
                const group = opts.options.find((g) => g.id === groupUpdate.id);
                if (!group)
                    throw new Error(
                        `Group with id ${groupUpdate.id} not found`,
                    );

                const optionPromises = groupUpdate.options.map(
                    async (optionUpdate) => {
                        const option = group.options.find(
                            (o) => o.id === optionUpdate.id,
                        );
                        if (!option)
                            throw new Error(
                                `Option with id ${optionUpdate.id} not found`,
                            );

                        const hasAccess = await option.canAccess(
                            user_id,
                            guild_id,
                        );
                        if (!hasAccess)
                            throw new Error(
                                `No permissions to manage option with id ${optionUpdate.id}`,
                            );

                        try {
                            await option.set(
                                user_id,
                                guild_id,
                                optionUpdate.value,
                            );
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

export default fp(GuildOptionsRoute, {
    name: 'Guild options route',
});
