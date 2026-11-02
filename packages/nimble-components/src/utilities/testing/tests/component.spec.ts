import {
    abortableRace,
    waitAbortTimer,
    waitForIntersectionObserverAsync,
    waitForResizeObserverAsync,
    waitTimeout
} from '../component';

describe('Component testing utilities', () => {
    async function expectAbortError(promise: Promise<unknown>): Promise<void> {
        await expectAsync(promise).toBeRejectedWith(
            jasmine.objectContaining({ name: 'AbortError' })
        );
    }

    describe('waitAbortTimer', () => {
        it('rejects with the message after the timeout', async () => {
            const { signal } = new AbortController();
            await expectAsync(
                waitAbortTimer({ signal, message: 'timed out', ms: 0 })
            ).toBeRejectedWithError('timed out');
        });

        it('defaults to a 5000ms timeout', async () => {
            const setTimeoutSpy = spyOn(window, 'setTimeout').and.callThrough();
            const abortController = new AbortController();
            const timer = waitAbortTimer({
                signal: abortController.signal,
                message: 'timed out'
            });
            expect(setTimeoutSpy).toHaveBeenCalledOnceWith(
                jasmine.any(Function),
                5000
            );
            abortController.abort();
            await expectAbortError(timer);
        });

        it('rejects with an AbortError and clears the timer when aborted before the timeout', async () => {
            const setTimeoutSpy = spyOn(window, 'setTimeout').and.callThrough();
            const clearTimeoutSpy = spyOn(
                window,
                'clearTimeout'
            ).and.callThrough();
            const abortController = new AbortController();
            const timer = waitAbortTimer({
                signal: abortController.signal,
                message: 'timed out'
            });
            const timeoutId = setTimeoutSpy.calls.mostRecent().returnValue;

            abortController.abort();

            await expectAbortError(timer);
            expect(clearTimeoutSpy).toHaveBeenCalledOnceWith(timeoutId);
        });

        it('rejects with an AbortError without starting a timer when the signal is already aborted', async () => {
            const setTimeoutSpy = spyOn(window, 'setTimeout').and.callThrough();
            const abortController = new AbortController();
            abortController.abort();

            const timer = waitAbortTimer({
                signal: abortController.signal,
                message: 'timed out'
            });

            await expectAbortError(timer);
            expect(setTimeoutSpy).not.toHaveBeenCalled();
        });

        it('cleans up once and ignores later aborts when the timeout elapses asynchronously', async () => {
            const clearTimeoutSpy = spyOn(
                window,
                'clearTimeout'
            ).and.callThrough();
            const abortController = new AbortController();

            await expectAsync(
                waitAbortTimer({
                    signal: abortController.signal,
                    message: 'timed out',
                    ms: 0
                })
            ).toBeRejectedWithError('timed out');
            expect(clearTimeoutSpy).toHaveBeenCalledTimes(1);

            abortController.abort();
            expect(clearTimeoutSpy).toHaveBeenCalledTimes(1);
        });

        it('cleans up once and ignores later aborts when the timeout elapses synchronously', async () => {
            const fakeTimeoutId = 42;
            // Elapse synchronously to resolve before the cleanup callback has been returned
            const setTimeoutSpy = spyOn(window, 'setTimeout').and.callFake(((
                handler: () => void
            ) => {
                handler();
                return fakeTimeoutId;
            }) as unknown as typeof window.setTimeout);
            const clearTimeoutSpy = spyOn(
                window,
                'clearTimeout'
            ).and.callThrough();
            const abortController = new AbortController();

            const timer = waitAbortTimer({
                signal: abortController.signal,
                message: 'timed out'
            });
            setTimeoutSpy.and.callThrough();

            await expectAsync(timer).toBeRejectedWithError('timed out');
            expect(clearTimeoutSpy).toHaveBeenCalledOnceWith(fakeTimeoutId);

            abortController.abort();
            expect(clearTimeoutSpy).toHaveBeenCalledTimes(1);
        });
    });

    describe('abortableRace', () => {
        let unhandledRejections: unknown[];
        const onUnhandledRejection = (event: PromiseRejectionEvent): void => {
            unhandledRejections.push(event.reason);
        };

        beforeEach(() => {
            unhandledRejections = [];
            window.addEventListener('unhandledrejection', onUnhandledRejection);
        });

        afterEach(() => {
            window.removeEventListener(
                'unhandledrejection',
                onUnhandledRejection
            );
        });

        it('provides an unaborted signal to the racers and aborts it once the race settles', async () => {
            let racerSignal: AbortSignal | undefined;
            let abortedDuringRace: boolean | undefined;

            await abortableRace(signal => {
                racerSignal = signal;
                abortedDuringRace = signal.aborted;
                return [Promise.resolve()];
            });

            expect(abortedDuringRace).toBeFalse();
            expect(racerSignal!.aborted).toBeTrue();
        });

        it('resolves with the value of an already resolved racer and clears the losing timer', async () => {
            const clearTimeoutSpy = spyOn(
                window,
                'clearTimeout'
            ).and.callThrough();

            const result = await abortableRace<string>(signal => [
                Promise.resolve('winner'),
                waitAbortTimer({ signal, message: 'timed out' })
            ]);

            expect(result).toBe('winner');
            expect(clearTimeoutSpy).toHaveBeenCalledTimes(1);
        });

        it('rejects with the error of a racer that rejects first and clears the losing timer', async () => {
            const clearTimeoutSpy = spyOn(
                window,
                'clearTimeout'
            ).and.callThrough();

            await expectAsync(
                abortableRace(signal => [
                    Promise.reject(new Error('racer failed')),
                    waitAbortTimer({ signal, message: 'timed out' })
                ])
            ).toBeRejectedWithError('racer failed');
            expect(clearTimeoutSpy).toHaveBeenCalledTimes(1);
        });

        it('rejects with the timer message when the other racers never settle', async () => {
            await expectAsync(
                abortableRace(signal => [
                    new Promise<void>(() => {}),
                    waitAbortTimer({ signal, message: 'timed out', ms: 0 })
                ])
            ).toBeRejectedWithError('timed out');
        });

        it('does not report unhandled rejections for the aborted racers that lost the race', async () => {
            await abortableRace(signal => [
                Promise.resolve(),
                waitAbortTimer({ signal, message: 'timed out' }),
                waitAbortTimer({ signal, message: 'also timed out' })
            ]);
            await waitTimeout(10);

            expect(unhandledRejections).toEqual([]);
        });

        describe('with a polling waiter', () => {
            // Similar to waiters that poll for a condition, e.g. waiting for mention mappings to apply
            let polls: number;
            let isConditionMet: () => boolean;
            const waitConditionMet = async (
                signal: AbortSignal
            ): Promise<void> => {
                while (!signal.aborted && !isConditionMet()) {
                    polls += 1;
                    // eslint-disable-next-line no-await-in-loop
                    await waitTimeout(1);
                }
            };

            beforeEach(() => {
                polls = 0;
            });

            it('resolves once the condition is met', async () => {
                isConditionMet = () => polls === 3;

                await abortableRace(signal => [
                    waitConditionMet(signal),
                    waitAbortTimer({ signal, message: 'timed out' })
                ]);

                expect(polls).toBe(3);
            });

            it('resolves without polling when the condition is already met', async () => {
                isConditionMet = () => true;

                await abortableRace(signal => [
                    waitConditionMet(signal),
                    waitAbortTimer({ signal, message: 'timed out' })
                ]);

                expect(polls).toBe(0);
            });

            it('stops polling once the timer wins the race', async () => {
                isConditionMet = () => false;

                await expectAsync(
                    abortableRace(signal => [
                        waitConditionMet(signal),
                        waitAbortTimer({ signal, message: 'timed out', ms: 20 })
                    ])
                ).toBeRejectedWithError('timed out');
                const pollsAtTimeout = polls;
                await waitTimeout(20);

                expect(pollsAtTimeout).toBeGreaterThan(0);
                expect(polls).toBe(pollsAtTimeout);
            });
        });

        describe('with an event waiter', () => {
            // Similar to waiters that listen for an event, e.g. waiting for a scroll event
            let target: EventTarget;
            let eventsReceived: number;
            const waitForTestEvent = async (
                signal: AbortSignal
            ): Promise<void> => {
                await new Promise<void>(resolve => {
                    target.addEventListener(
                        'test-event',
                        () => {
                            eventsReceived += 1;
                            resolve();
                        },
                        { once: true, signal }
                    );
                });
            };

            beforeEach(() => {
                target = new EventTarget();
                eventsReceived = 0;
            });

            it('resolves when the event is dispatched', async () => {
                const race = abortableRace(signal => [
                    waitForTestEvent(signal),
                    waitAbortTimer({ signal, message: 'timed out' })
                ]);
                target.dispatchEvent(new Event('test-event'));

                await expectAsync(race).toBeResolved();
                expect(eventsReceived).toBe(1);
            });

            it('removes the event listener once the timer wins the race', async () => {
                await expectAsync(
                    abortableRace(signal => [
                        waitForTestEvent(signal),
                        waitAbortTimer({ signal, message: 'timed out', ms: 0 })
                    ])
                ).toBeRejectedWithError('timed out');
                target.dispatchEvent(new Event('test-event'));

                expect(eventsReceived).toBe(0);
            });
        });

        describe('with observer waiters', () => {
            let element: HTMLElement;

            beforeEach(() => {
                element = document.createElement('div');
                element.style.width = '10px';
                element.style.height = '10px';
                document.body.appendChild(element);
            });

            afterEach(() => {
                element.remove();
            });

            it('resolves on a ResizeObserver notification and disconnects the observer', async () => {
                const disconnectSpy = spyOn(
                    ResizeObserver.prototype,
                    'disconnect'
                ).and.callThrough();

                await abortableRace(signal => [
                    waitForResizeObserverAsync({ signal, element }),
                    waitAbortTimer({ signal, message: 'timed out' })
                ]);

                expect(disconnectSpy).toHaveBeenCalledTimes(1);
            });

            it('rejects with an AbortError and disconnects the ResizeObserver when aborted', async () => {
                const disconnectSpy = spyOn(
                    ResizeObserver.prototype,
                    'disconnect'
                ).and.callThrough();
                const abortController = new AbortController();

                const wait = waitForResizeObserverAsync({
                    signal: abortController.signal,
                    element
                });
                abortController.abort();

                await expectAbortError(wait);
                expect(disconnectSpy).toHaveBeenCalledTimes(1);
            });

            it('resolves on an IntersectionObserver notification and disconnects the observer', async () => {
                const disconnectSpy = spyOn(
                    IntersectionObserver.prototype,
                    'disconnect'
                ).and.callThrough();

                await abortableRace(signal => [
                    waitForIntersectionObserverAsync({
                        signal,
                        elements: [element],
                        root: document.body
                    }),
                    waitAbortTimer({ signal, message: 'timed out' })
                ]);

                expect(disconnectSpy).toHaveBeenCalledTimes(1);
            });

            it('rejects with an AbortError and disconnects the IntersectionObserver when aborted', async () => {
                const disconnectSpy = spyOn(
                    IntersectionObserver.prototype,
                    'disconnect'
                ).and.callThrough();
                const abortController = new AbortController();

                const wait = waitForIntersectionObserverAsync({
                    signal: abortController.signal,
                    elements: [element],
                    root: document.body
                });
                abortController.abort();

                await expectAbortError(wait);
                expect(disconnectSpy).toHaveBeenCalledTimes(1);
            });

            it('resolves without an IntersectionObserver when there are no elements', async () => {
                const observeSpy = spyOn(
                    IntersectionObserver.prototype,
                    'observe'
                ).and.callThrough();

                await abortableRace(signal => [
                    waitForIntersectionObserverAsync({
                        signal,
                        elements: [],
                        root: document.body
                    }),
                    waitAbortTimer({ signal, message: 'timed out' })
                ]);

                expect(observeSpy).not.toHaveBeenCalled();
            });
        });
    });
});
