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
    platformBrowserDynamicTesting()
);
// Then we find all the tests.
const context = require.context('./', true, /\.spec\.ts$/);
// And load the modules.
context.keys().map(context);

// Workaround to make console.error calls fail tests:
// https://github.com/angular/angular/issues/36430#issuecomment-874772398
// Might be removable after upgrading to Angular 14:
// https://github.com/angular/angular/issues/36430#issuecomment-1117801535
// eslint-disable-next-line no-console, @typescript-eslint/no-explicit-any
console.error = (data: any): void => fail(data);