import { FormOptionBuilders, ResponseStatusBuilders } from '../../../../../src';

let a = 'a';

export default new FormOptionBuilders.Guild.TextInputBuilder()
    .setId('b')
    .setName('name')
    .setDescription('Description')
    .onRequest(async (user_id, guild_id) => {
        return a;
    })
    .onAccessCheck(async (user_id, guild_id) => {
        return ResponseStatusBuilders.AccessControlResponses.Disallowed(true, "not allowed");
    })
    .onUpdate(async (user_id, guild_id, value) => {
        a = value;
        return ResponseStatusBuilders.SetResponses.Error("There was an error");
    })
    .build();
