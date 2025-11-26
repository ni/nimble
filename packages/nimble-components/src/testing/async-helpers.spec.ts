import { describe, it, expect, vi } from 'vitest';
import { waitForUpdatesAsync } from './async-helpers';

describe('Async Helpers (Vitest)', () => {
    it('waitForUpdatesAsync resolves in real timer mode', async () => {
        let resolved = false;
        const promise = waitForUpdatesAsync().then(() => {
            resolved = true;
        });
        expect(resolved).toBe(false);
        await promise;
        expect(resolved).toBe(true);
    });

    it('waitForUpdatesAsync works with fake timers', async () => {
        vi.useFakeTimers();
        let resolved = false;
        const promise = waitForUpdatesAsync().then(() => {
            resolved = true;
        });

        // FAST uses requestAnimationFrame, which is mocked by vi.useFakeTimers()
        // We need to advance time to trigger it.
        await vi.advanceTimersByTimeAsync(20); // 1 frame is ~16ms

        expect(resolved).toBe(true);
        await promise;
        vi.useRealTimers();
    });
});
