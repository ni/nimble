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
    return new Promise(resolve => {
        setTimeout(resolve, 0);
    });
}