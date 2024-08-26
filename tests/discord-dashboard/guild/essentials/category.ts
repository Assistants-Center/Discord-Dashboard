import { GroupBuilders, getFilesFromDirectory, ResponseStatusBuilders } from '../../../../src';
import type { GuildFormOption } from '@discord-dashboard/typings/dist/FormOptions/FormOption';
import path from 'node:path';

export default new GroupBuilders.Guild()
    .setId('essentials')
    .onAccessCheck(async (user_id: string, guild_id: string) => {
        return ResponseStatusBuilders.AccessControlResponses.Disallowed(true, "not allowed");
    })
    .setOptions(
        getFilesFromDirectory<GuildFormOption<any>>(
            path.join(__dirname, 'options'),
        ),
    )
    .build();
