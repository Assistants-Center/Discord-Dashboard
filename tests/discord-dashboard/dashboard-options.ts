import { getFilesFromDirectory } from '../../src';
import path from 'node:path';
import {
    GuildFormOptionGroup,
    UserFormOptionGroup,
} from '@discord-dashboard/typings/dist/FormOptions/FormGroup';

const guildOptions = [
    ...getFilesFromDirectory<GuildFormOptionGroup>(
        path.join(__dirname, 'guild/essentials'),
    ),
];
const userOptions = [
    ...getFilesFromDirectory<UserFormOptionGroup>(
        path.join(__dirname, 'user/global-colors'),
    ),
];

export { guildOptions, userOptions };
