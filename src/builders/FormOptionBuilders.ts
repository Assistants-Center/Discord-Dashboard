import { TextInputBuilder as GuildTextInput } from './guild/TextInput';

const Guild = {
    TextInputBuilder: GuildTextInput,
};

import { TextInputBuilder as UserTextInput } from './user/TextInput';

const User = {
    TextInputBuilder: UserTextInput,
};

export default { Guild, User };
