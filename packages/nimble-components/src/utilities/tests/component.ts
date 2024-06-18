import { waitForUpdatesAsync } from '../../testing/async-helpers';

export async function clickElement(element: HTMLElement): Promise<void> {
    element.click();
    await waitForUpdatesAsync();
}

/** A helper function to abstract turning waiting for an event to fire into a promise.
 * The returned promise should be resolved prior to completing a test.
 */
export async function waitForEventAsync(
    element: HTMLElement,
    eventName: string
): Promise<void> {
    return new Promise(resolve => {
        const handler = (): void => {
            element.removeEventListener(eventName, handler);
            resolve();
        };
        element.addEventListener(eventName, handler);
    });
}

/** A helper function to abstract adding an event listener, spying
 * on the event being called, and removing the event listener. The returned promise
 * should be resolved prior to completing a test.
 */
export function createEventListener(
    element: HTMLElement,
    eventName: string
): {
        promise: Promise<void>,
        spy: jasmine.Spy
    } {
    const spy = jasmine.createSpy();
    return {
        promise: new Promise(resolve => {
            const handler = (...args: unknown[]): void => {
                element.removeEventListener(eventName, handler);
                spy(...args);
                resolve();
            };
            element.addEventListener(eventName, handler);
        }),
        spy
    };
}

/**
 * Waits for a requested animation frame to occur.
 */
export async function waitAnimationFrame(): Promise<void> {
    return new Promise(resolve => {
        requestAnimationFrame(() => resolve());
    });
}
