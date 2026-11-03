// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js';
import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
    BrowserTestingModule,
    platformBrowserTesting
} from '@angular/platform-browser/testing';

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
    BrowserTestingModule,
    platformBrowserTesting(),
    {
        errorOnUnknownElements: true,
        errorOnUnknownProperties: true
    }
);

// Elevate console errors and warnings to test failures
// eslint-disable-next-line no-console, @typescript-eslint/no-explicit-any
console.error = (data: any): void => fail(data);
// eslint-disable-next-line no-console, @typescript-eslint/no-explicit-any
console.warn = (data: any): void => fail(data);

// Load the Nimble fonts before any tests run so text renders consistently across platforms
// instead of using each machine's default font, and so swappable fonts do not swap in mid-test
beforeAll(async () => {
    const fontLoads: Promise<FontFace>[] = [];
    document.fonts.forEach(fontFace => {
        if (fontFace.display === 'swap') {
            fontLoads.push(fontFace.load());
        }
    });
    if (fontLoads.length === 0) {
        throw new Error('Nimble fonts were not registered');
    }
    await Promise.all(fontLoads);
});
