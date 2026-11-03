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

function createAbortError(): Error {
    return new DOMException('The wait was aborted', 'AbortError');
}

/**
 * Creates a promise that resolves via the provided executor, or rejects when the signal is aborted.
 * The cleanup callback returned by the executor runs when the promise settles either way.
 */
async function waitAbortable(
    signal: AbortSignal,
    executor: (resolve: () => void) => () => void
): Promise<void> {
    if (signal.aborted) {
        throw createAbortError();
    }
    await new Promise<void>((resolve, reject) => {
        let settled = false;
        let cleanupExecutor: (() => void) | undefined;
        const onAbort = (): void => {
            settled = true;
            cleanupExecutor?.();
            reject(createAbortError());
        };
        signal.addEventListener('abort', onAbort, { once: true });
        cleanupExecutor = executor(() => {
            settled = true;
            signal.removeEventListener('abort', onAbort);
            cleanupExecutor?.();
            resolve();
        });
        // Handle an executor that resolves synchronously, before its cleanup callback was available
        if (settled) {
            cleanupExecutor();
        }
    });
}

/**
 * Races the promises created by the callback and aborts the provided signal once the race settles,
 * so that the remaining waits (e.g. observers, timers, and polling loops) are cleaned up.
 * @example
 * await abortableRace(signal => [
 *     waitForResizeObserverAsync({ signal, element }),
 *     waitAbortTimer({ signal, message: 'ResizeObserver notification was not received' })
 * ]);
 */
export async function abortableRace<T>(
    createRacers: (signal: AbortSignal) => readonly Promise<T>[]
): Promise<T> {
    const abortController = new AbortController();
    try {
        return await Promise.race(createRacers(abortController.signal));
    } finally {
        abortController.abort();
    }
}

/**
 * Waits for the next ResizeObserver notification for the element.
 * ResizeObservers are notified in creation order within a frame, so any observer created before
 * calling this function (e.g. a component's own observer of the element) has handled pending size
 * changes when this resolves. Rejects if the signal is aborted first.
 */
export async function waitForResizeObserverAsync({
    signal,
    element
}: {
    signal: AbortSignal,
    element: Element
}): Promise<void> {
    await waitAbortable(signal, resolve => {
        const resizeObserver = new ResizeObserver(() => resolve());
        resizeObserver.observe(element);
        return () => resizeObserver.disconnect();
    });
}

/**
 * Waits for the next IntersectionObserver notification for the elements within the root.
 * IntersectionObserver notifications for all observers are delivered together in a single task
 * after layout, so any observer of the elements created before calling this function
 * (e.g. a component's own observer) has handled pending intersection changes when this resolves.
 * Resolves immediately if there are no elements, as no notification would be delivered.
 * Rejects if the signal is aborted first.
 */
export async function waitForIntersectionObserverAsync({
    signal,
    elements,
    root
}: {
    signal: AbortSignal,
    elements: readonly Element[],
    root: Element
}): Promise<void> {
    if (elements.length === 0) {
        return;
    }
    await waitAbortable(signal, resolve => {
        const intersectionObserver = new IntersectionObserver(
            () => resolve(),
            { root }
        );
        elements.forEach(element => intersectionObserver.observe(element));
        return () => intersectionObserver.disconnect();
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
 * Rejects with the given message after the timeout. Use with `abortableRace` to bound another wait, e.g. an
 * observer notification that normally arrives within a frame or two but that browsers (notably WebKit) can defer,
 * so the current test fails with a clear message rather than hanging until the jasmine timeout.
 * The timer is cleared when the signal is aborted.
 */
export async function waitAbortTimer({
    signal,
    message,
    ms = 5000
}: {
    signal: AbortSignal,
    message: string,
    ms?: number
}): Promise<never> {
    await waitAbortable(signal, resolve => {
        const timeoutId = window.setTimeout(() => resolve(), ms);
        return () => window.clearTimeout(timeoutId);
    });
    throw new Error(message);
}
