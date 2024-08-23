import { GroupBuilders, getFilesFromDirectory } from '../../../../src';
import type { GuildFormOption } from '@discord-dashboard/typings/dist/FormOptions/FormOption';
import path from 'node:path';

export default new GroupBuilders.Guild()
    .setId('essentials')
    .setOptions(
        getFilesFromDirectory<GuildFormOption<any>>(
            path.join(__dirname, 'options'),
        ),
    )
    .build();
