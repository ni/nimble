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
        spec.accessPrivateResult = function () {
            // We're accessing an internal API.
            // This accommodates for a breaking change from v5 to v6
            return this.getResult() || this.doneEvent();
        }
        const originalTestFn = spec.queueableFn.fn;
        const beforeAfterFns = spec.beforeAndAfterFns();

        spec.queueableFn.fn = async function () {
            let exceptionCaught;
            let returnValue;
            let that = this;

            let i = 0;
            let failed = false;
            do {
                if (i !== 0) {
                    // Retry cleanup/wait/setup
                    console.log(`\
FAILED: ${spec.getFullName()}
${getFailureDetails(spec.accessPrivateResult())}

Retrying... (${i}/${retries})`);
                    for (let j = 0; j < beforeAfterFns.afters.length; j += 1) {
                        await run(that, beforeAfterFns.afters[j].fn);
                    }
                    await new Promise(resolve => {
                        setTimeout(resolve, millisecondsBetweenRetries);
                    });
                    for (let j = 0; j < beforeAfterFns.befores.length; j += 1) {
                        await run(that, beforeAfterFns.befores[j].fn);
                    }
                }

                spec.reset();
                returnValue = undefined;
                exceptionCaught = undefined;

                try {
                    returnValue = await run(that, originalTestFn);
                } catch (exception) {
                    exceptionCaught = exception;
                }
                failed = spec.accessPrivateResult().status === 'failed' || exceptionCaught !== undefined;
            } while (failed && ++i <= retries);

            if (exceptionCaught) {
                throw exceptionCaught;
            }
            return returnValue;
        };

        return spec;
    };

    function getFailureDetails(result: any): string {
        return (result.failedExpectations as { message: string }[])
            .map(x => `        ${x.message}`)
            .join('\n');
    }
}
/* eslint-enable */
