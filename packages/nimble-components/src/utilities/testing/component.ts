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
export async function waitForEvent<T extends Event>(
    element: HTMLElement,
    eventName: string,
    callback?: (evt: T) => void
): Promise<void> {
    await new Promise<void>(resolve => {
        const handler = ((evt: T): void => {
            callback?.(evt);
            resolve();
        }) as EventListener;
        element.addEventListener(eventName, handler, {
            once: true
        });
    });
}

/**
 * Waits for a requested animation frame to occur.
 */
export async function waitAnimationFrame(): Promise<void> {
    await new Promise<void>(resolve => {
        requestAnimationFrame(() => resolve());
    });
}

/**
 * Waits for the next ResizeObserver notification for the target.
 * ResizeObservers are notified in creation order within a frame, so any observer created before
 * calling this function (e.g. a component's own observer of the target) has handled pending size
 * changes when this resolves.
 */
export async function waitForResizeObserverAsync(
    target: Element
): Promise<void> {
    await new Promise<void>(resolve => {
        const resizeObserver = new ResizeObserver(() => {
            resizeObserver.disconnect();
            resolve();
        });
        resizeObserver.observe(target);
    });
}

/**
 * Waits for the next IntersectionObserver notification for the targets within the root.
 * IntersectionObserver notifications for all observers are delivered together in a single task
 * after layout, so any observer of the targets created before calling this function
 * (e.g. a component's own observer) has handled pending intersection changes when this resolves.
 * Resolves immediately if there are no targets, as no notification would be delivered.
 */
export async function waitForIntersectionObserverAsync(
    targets: readonly Element[],
    root: Element
): Promise<void> {
    if (targets.length === 0) {
        return;
    }
    await new Promise<void>(resolve => {
        const intersectionObserver = new IntersectionObserver(() => {
            intersectionObserver.disconnect();
            resolve();
        }, { root });
        targets.forEach(target => intersectionObserver.observe(target));
    });
}

/**
 * Timeout for use in async tets.
 */
export async function waitTimeout(ms = 0): Promise<void> {
    await new Promise(resolve => {
        window.setTimeout(() => resolve(undefined), ms);
    });
}

/**
 * Rejects with the given message after the timeout. Use with `Promise.race` to bound another wait, e.g. an
 * observer notification that normally arrives within a frame or two but that browsers (notably WebKit) can defer,
 * so the current test fails with a clear message rather than hanging until the jasmine timeout.
 * Rejecting after losing a race is not reported as an unhandled rejection, so the timer does not need to be cleared.
 */
export async function waitAbortTimer(message: string, ms = 5000): Promise<never> {
    await waitTimeout(ms);
    throw new Error(message);
}
