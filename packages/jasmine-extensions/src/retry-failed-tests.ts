// Modified From: https://github.com/jasmine/jasmine/issues/960#issuecomment-2349768674
/* eslint-disable */
export function retryFailedTests(
    retries: number,
    millisecondsBetweenRetries: number,
): void {
    // Handles both styles of async (Promises and done()) and returns a
    // Promise.  Wraps synchronous fns in a Promise, too.
    const run = (that: any, fn: Function) => {
        if (fn.length == 0) {
            return fn.call(that);
        }
        return new Promise(resolve => {
            fn.call(that, resolve);
        });
    };

    const setTimeout = globalThis.setTimeout;
    // @ts-expect-error Global Jasmine Spec type undefined
    const originalSpecConstructor = jasmine.Spec;
    // @ts-expect-error Global Jasmine Spec type undefined
    jasmine.Spec = function retrySpec(attrs: any): jasmine.Spec {
        const spec = new originalSpecConstructor(attrs);
        const originalTestFn = spec.queueableFn.fn;
        const beforeAfterFns = spec.beforeAndAfterFns();

        spec.queueableFn.fn = async function () {
            let exceptionCaught;
            let returnValue;
            let that = this;

            for (let i = 0; i < retries; ++i) {
                spec.reset();
                returnValue = undefined;
                exceptionCaught = undefined;

                try {
                    returnValue = await run(that, originalTestFn);
                } catch (exception) {
                    exceptionCaught = exception;
                }
                const failed =
                    !spec.markedPending &&
                    (exceptionCaught ||
                        spec.result.failedExpectations.length != 0);
                if (!failed) {
                    break;
                }

                if (millisecondsBetweenRetries && i != retries - 1) {
                    console.log(
                        `Test "${spec.getFullName()}" failed, attempting retry ${i + 1}. Will clean-up last run by running afterEach, re-setup by running beforeEach, wait ${millisecondsBetweenRetries}ms, and rerun the test`
                    );
                    for (let j = 0; j < beforeAfterFns.afters.length; j += 1) {
                        await run(that, beforeAfterFns.afters[j].fn);
                    }
                    for (let j = 0; j < beforeAfterFns.befores.length; j += 1) {
                        await run(that, beforeAfterFns.befores[j].fn);
                    }
                    await new Promise(resolve => {
                        setTimeout(resolve, millisecondsBetweenRetries);
                    });
                }
            }

            if (exceptionCaught) {
                throw exceptionCaught;
            }
            return returnValue;
        };

        return spec;
    };
}
/* eslint-enable */
