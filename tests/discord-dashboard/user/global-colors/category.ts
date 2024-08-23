import { GroupBuilders, getFilesFromDirectory } from '../../../../src';
import { UserFormOption } from '@discord-dashboard/typings/dist/FormOptions/FormOption';
import path from 'node:path';

export default new GroupBuilders.Guild()
    .setId('essentials')
    .setOptions(
        getFilesFromDirectory<UserFormOption<any>>(
            path.join(__dirname, 'options'),
        ),
    )
    .build();
