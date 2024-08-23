import { FormOptionBuilders, ResponseStatusBuilders } from '../../../../../src';

export default new FormOptionBuilders.Guild.TextInputBuilder()
    .setId('b')
    .onRequest(async (user_id, guild_id) => {
        return 'a';
    })
    .onUpdate(async (user_id, guild_id, value) => {
        return ResponseStatusBuilders.SetResponses.Ok();
    })
    .build();
