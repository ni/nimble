# Research: Replace Karma/Webpack/Jasmine with Vite/Vitest

**Feature**: 001-vitest-migration
**Date**: 2025-11-25

## Decisions

### 1. Test Runner & Framework
**Decision**: Use **Vitest** as the test runner and **Vite** as the build tool.
**Rationale**: Vitest offers native Vite integration, faster execution, and a modern watch mode. It replaces Karma (runner) and Webpack (bundler).

### 2. Browser Environment
**Decision**: Use **@vitest/browser** with **Playwright** provider.
**Rationale**: This allows running tests in real Chrome, Firefox, and WebKit browsers (headless or headed), matching the current browser matrix support. It replaces the Karma launchers.

### 3. Jasmine Migration
**Decision**: Migrate from `jasmine` globals to `vi` utilities.
**Rationale**: Vitest does not support `jasmine` globals natively.
- `jasmine.createSpy()` -> `vi.fn()`
- `jasmine.createSpyObj()` -> Custom helper or manual object creation.
- `jasmine.clock()` -> `vi.useFakeTimers()`
- `jasmine.any()` -> `expect.any()`
- `jasmine.objectContaining()` -> `expect.objectContaining()`

**Alternatives Considered**:
- *Jasmine compatibility plugin*: None widely maintained or reliable found.
- *Keeping Karma*: Rejected due to performance issues and "disconnected" errors on macOS.

### 4. Configuration Strategy
**Decision**: Create a `vitest.config.ts` in `packages/nimble-components`.
**Rationale**: Keeps configuration close to the code.

## Implementation Details

### Jasmine `createSpyObj` Helper
Since `vi.createSpyObj` doesn't exist, we will add this helper to `src/testing/spy-helpers.ts` (or similar):

```typescript
import { vi } from 'vitest';

export function createSpyObj<T>(baseName: string, methodNames: string[]): any {
    const obj: any = {};
    for (const method of methodNames) {
        obj[method] = vi.fn();
    }
    return obj;
}
```

### Browser Configuration
`vitest.config.ts` example:

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    browser: {
      enabled: true,
      provider: 'playwright',
      name: 'chromium', // Default, can be overridden via CLI
      headless: true,
    },
    setupFiles: ['./src/utilities/tests/setup-configuration.ts'],
  },
});
```

### Cleanup
We must ensure `document.body` is cleaned up after each test, as Vitest browser mode runs in a real browser context where DOM persists.

```typescript
afterEach(() => {
  document.body.innerHTML = '';
});
```
