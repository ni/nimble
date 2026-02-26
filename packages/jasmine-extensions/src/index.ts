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
    // todo lookup karma-jasmine and insert after like jasmine-spec-tags does
    // and grab config from client like jasmine-spec-tags
    // https://github.com/mnasyrov/karma-jasmine-spec-tags/blob/720113cf73ce8ead564355c82273830e964eb0c9/src/framework.js#L5-L46
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
