import { DOM } from '@ni/nimble-components/dist/esm/testing/dom';

/**
 * Resolves with the next Microtask.
 */
export async function waitMicrotask(): Promise<void> {
    return new Promise(queueMicrotask);
}

/**
 * Resolves with the next Task.
 *
 * Prefer using waitMicrotask() over this function when possible.
 * Examples of when it is necessary to use this function:
 * 1. Waiting for slotted content properties on Nimble components to be initialized
 */
export async function waitTask(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, 0));
}

/**
 * Resolves with the next DOM update.
 *
 * Prefer using waitMicrotask() or waitTask() over this function when possible.
 * Examples of when it is necessary to use this function:
 * 1. Waiting for attribute values to be reflected from properties in Nimble components.
 */
export const waitAnimationFrame = DOM.nextUpdate;

/**
 * Immediately processes all work scheduled through DOM.nextUpdate
 *
 * Useful for synchronously testing Nimble elements. Call this in fakeAsync tests to
 * immediately resolve tasks which otherwise would require waiting for an animation
 * frame. This should also be called after every fakeAsync test to clear the internal
 * process queue and allow subsequent tests to run normally.
 */
export const processDomUpdates = DOM.processUpdates;