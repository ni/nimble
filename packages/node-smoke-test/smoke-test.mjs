// Server-side rendering (SSR) smoke test.
//
// Web components extend `HTMLElement`, register via `customElements`, and read
// browser globals (`document`, `window`, `CSS`, ...). Frameworks like Next.js
// still evaluate these modules on the server during prerendering, so touching a
// browser global at module-evaluation time throws (e.g. "document is not
// defined") and breaks the build.
//
// This test evaluates the entire component graph in a DOM-less Node context via
// Vite's SSR module loader. `@ni/ok-components/all-components` is the transitive
// root: it imports Ok, which imports Spright, which imports Nimble (and Fast).
// If any module accesses a browser global while loading, `ssrLoadModule` rejects
// and the process exits non-zero.

import { createServer } from 'vite';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const entry = require.resolve('@ni/ok-components/dist/esm/all-components.js');

// A representative sample of tags from each library. Registration is a no-op
// server-side, but the SSR `customElements` shim records definitions, so a
// registered tag proves the module both loaded and ran its `define()` call.
const expectedTags = [
    'nimble-button',
    'nimble-table',
    'nimble-theme-provider',
    'spright-rectangle',
    'ok-ex-button'
];

const server = await createServer({
    configFile: false,
    logLevel: 'error',
    // Transform (rather than externalize) the @ni packages so Vite's resolver
    // handles their extensionless / directory ESM imports. Without this Vite
    // hands them to Node's loader, which rejects directory imports.
    ssr: { noExternal: [/^@ni\//] }
});

try {
    await server.ssrLoadModule(entry);

    const missing = expectedTags.filter(
        tag => !globalThis.customElements?.get?.(tag)
    );
    if (missing.length > 0) {
        throw new Error(
            `Components failed to register server-side: ${missing.join(', ')}`
        );
    }

    console.log(
        `SSR smoke test passed: all-components evaluated without a DOM `
        + `(${expectedTags.length} sample tags registered).`
    );
} finally {
    await server.close();
}
