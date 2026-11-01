// Scripts that should run at the very beginning of jasmine tests
// Test setup is not in the published package so can use devDependencies
// eslint-disable-next-line import/no-extraneous-dependencies
import '@ni/nimble-tokens/dist/fonts/css/fonts.css';

// Elevate console errors and warnings to test failures
// eslint-disable-next-line no-console, @typescript-eslint/no-explicit-any
console.error = (data: any): void => fail(data);
// eslint-disable-next-line no-console, @typescript-eslint/no-explicit-any
console.warn = (data: any): void => fail(data);
jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

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
