/**
 * The main entrypoint for the karma plugin that is run by karma node
 */

import type { ConfigOptions } from 'karma';
import * as path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

function jasmineExtensionsFrameworkFactory(config: ConfigOptions): void {
    if (!Array.isArray(config.files)) {
        return;
    }

    const pattern = path.resolve(getAbsolutePath('@ni-private/jasmine-extensions'), './dist/browser-bundle.js');
    config.files.unshift({
        pattern,
        included: true,
        served: true,
        watched: false
    });
}

const jasmineExtensions = ['factory', jasmineExtensionsFrameworkFactory];

function getAbsolutePath(value: string): string {
    return path.dirname(require.resolve(path.join(value, 'package.json')));
}

export { jasmineExtensions as 'framework:jasmine-extensions' };
