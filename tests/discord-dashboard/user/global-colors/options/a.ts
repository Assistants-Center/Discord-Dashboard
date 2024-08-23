import { FormOptionBuilders, ResponseStatusBuilders } from '../../../../../src';

export default new FormOptionBuilders.User.TextInputBuilder()
    .setId('a')
    .onRequest(async (user_id) => {
        return 'b';
    })
    .onUpdate(async (user_id, value) => {
        return ResponseStatusBuilders.SetResponses.Ok();
    })
    .build();
