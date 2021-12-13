import { queueAsyncUpdate, processUpdateQueueSync as processUpdateQueueSyncOriginal } from '@ni/nimble-components/dist/esm/testing/async-helpers';

export { queueAsyncUpdate };

/**
 * Immediately processes all updates in queue.
 *
 * Useful for synchronously testing Nimble elements. Call this in fakeAsync tests to
 * immediately resolve tasks which otherwise would require waiting for an animation
 * frame. This should also be called after every fakeAsync test to clear the internal
 * process queue and allow subsequent tests to run normally.
 */
export const processUpdateQueueSync = processUpdateQueueSyncOriginal;