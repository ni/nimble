// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js';
import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
    BrowserDynamicTestingModule,
    platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

declare const require: {
    context(path: string, deep?: boolean, filter?: RegExp): {
        keys(): string[],
        <T>(id: string): T
    }
};

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
    BrowserDynamicTestingModule,
    platformBrowserDynamicTesting(),
    {
        teardown: { destroyAfterEach: false },
        errorOnUnknownElements: true,
        errorOnUnknownProperties: true
    }
);
// Then we find all the tests.
const context = require.context('./', true, /\.spec\.ts$/);
// And load the modules.
context.keys().map(context);

// Elevate console errors to test failures
// eslint-disable-next-line no-console, @typescript-eslint/no-explicit-any
console.error = (data: any): void => fail(data);