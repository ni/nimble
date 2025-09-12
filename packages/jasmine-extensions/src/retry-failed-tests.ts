// From: https://github.com/jasmine/jasmine/issues/960#issuecomment-2349768674
/* eslint-disable */
export function retryFailedTests(
    retries: number,
    millisecondsBetweenRetries: number,
): void {
    const setTimeout = globalThis.setTimeout;
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
