/* eslint-disable func-names */
// Scripts that should run at the very beginning of jasmine tests

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace jasmine {
    /**
     * Jasmine Spec class
     */
    // class Spec {
    //     public queueableFn: {
    //         fn: () => Promise<void>
    //     };
    // }
    // eslint-disable-next-line @typescript-eslint/naming-convention
    // function Spec(): Spec;
}

// Elevate console errors and warnings to test failures
// eslint-disable-next-line no-console, @typescript-eslint/no-explicit-any
console.error = (data: any): void => fail(data);
// eslint-disable-next-line no-console, @typescript-eslint/no-explicit-any
console.warn = (data: any): void => fail(data);
jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

// From: https://github.com/jasmine/jasmine/issues/960#issuecomment-2349768674
/* eslint-disable */
function retryFailedTests(
    retries: number,
    millisecondsBetweenRetries: number,
    setTimeout: typeof window.setTimeout
): void {
    // @ts-expect-error sdf
    const originalSpecConstructor = jasmine.Spec;
    // @ts-expect-error sdf
    jasmine.Spec = function retrySpec(attrs: any): jasmine.Spec {
        const spec = new originalSpecConstructor(attrs);
        const originalTestFn = spec.queueableFn.fn;

        // Handles both styles of async testing (Promises and done()) and returns a
        // Promise.  Wraps synchronous tests in a Promise, too.
        const runOriginalTest = () => {
            if (originalTestFn.length == 0) {
                return originalTestFn();
            }
            return new Promise(resolve => {
                originalTestFn(resolve);
            });
        };

        spec.queueableFn.fn = async function () {
            let exceptionCaught;
            let returnValue;

            for (let i = 0; i < retries; ++i) {
                spec.reset();
                returnValue = undefined;
                exceptionCaught = undefined;

                try {
                    returnValue = await runOriginalTest();
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
                        `Test ${spec.getFullName()} failed, attempting retry ${i + 1} in ${millisecondsBetweenRetries}ms`
                    );
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
retryFailedTests(5, 1000, window.setTimeout);
