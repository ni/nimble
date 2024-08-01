import { waitForUpdatesAsync } from '../../testing/async-helpers';

export async function clickElement(element: HTMLElement): Promise<void> {
    element.click();
    await waitForUpdatesAsync();
}

export async function sendKeyDownEvent(
    target: HTMLElement,
    key: string,
    init?: KeyboardEventInit
): Promise<KeyboardEvent> {
    return (
        await sendKeyDownEvents(target, [key], init ? [init] : undefined)
    )[0]!;
}

export async function sendKeyDownEvents(
    target: HTMLElement,
    keySequence: string[],
    init?: KeyboardEventInit[]
): Promise<KeyboardEvent[]> {
    if (keySequence.length === 0) {
        throw new Error('The key sequence must have at least one key.');
    }
    if (init && init.length !== keySequence.length) {
        throw new Error(
            'The length of the key sequence and the init array must match.'
        );
    }
    const events: KeyboardEvent[] = [];
    for (const [index, key] of keySequence.entries()) {
        const event = new KeyboardEvent('keydown', {
            key,
            cancelable: true,
            bubbles: true,
            ...init?.[index]
        });
        target.dispatchEvent(event);
        events.push(event);
    }
    await waitForUpdatesAsync();
    return events;
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
