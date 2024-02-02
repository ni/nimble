import { waitForUpdatesAsync } from '../../testing/async-helpers';

export async function clickElement(element: HTMLElement): Promise<void> {
    element.click();
    await waitForUpdatesAsync();
}

export function keydownOnActiveElement(key: string): KeyboardEvent {
    const keydownEvent = new KeyboardEvent('keydown', {
        key,
        bubbles: true,
        cancelable: true
    });
    document.activeElement!.dispatchEvent(keydownEvent);
    return keydownEvent;
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
