/*!
 * @copyright Card Librarian Team 2020
 */

import { Logger } from '@flyacts/backend';
import * as fs from 'fs-extra';
import * as yaml from 'js-yaml';
import * as path from 'path';

// tslint:disable-next-line:no-floating-promises
(async function() {
    const logger = new Logger();
    try {
        // tslint:disable-next-line: no-any
        const doc = yaml.safeLoad(await fs.readFile(path.resolve(__dirname, `docker-compose.yml`), 'utf8')) as any;

        const packageJson = require(path.resolve(__dirname, '../package.json'));

        doc.services.api.image = `cardlibrarian/backend:${packageJson.version}.${process.env.JOB_ID}`;

        await fs.writeFile(path.resolve(__dirname, '../docker-compose.yml'), yaml.safeDump(doc));

        process.exit(0);
    } catch (error) {
        logger.error('Failed to generate compose file', error);
        process.exit(1);
    }
})();
