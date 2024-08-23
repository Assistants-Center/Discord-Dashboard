import path from 'node:path';
import fs from 'node:fs';

export default function getFilesFromDirectory<T>(directory: string): T[] {
    const options: T[] = [];

    if (fs.existsSync(directory)) {
        const files = fs.readdirSync(directory);

        for (const file of files) {
            const fullPath = path.join(directory, file);
            if (
                fs.statSync(fullPath).isFile() &&
                (file.endsWith('.ts') || file.endsWith('.js'))
            ) {
                try {
                    const module = require(
                        fullPath.replace(/\.ts$/, '').replace(/\.js$/, ''),
                    );
                    options.push(module.default);
                } catch (error) {
                    console.error(`Error importing ${fullPath}:`, error);
                }
            }
        }
    }

    return options;
}
