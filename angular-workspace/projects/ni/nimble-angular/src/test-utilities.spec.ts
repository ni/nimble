// Workaround for https://github.com/angular/angular-cli/issues/18177
// Capture runtime error logs and convert them to exceptions
{
    let originalError: typeof console.error;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    jasmine.getEnv().beforeEach(() => {
        // eslint-disable-next-line no-console
        originalError = console.error;
        // eslint-disable-next-line no-console
        console.error = (message): void => {
            if (typeof message === 'string') {
                throw new Error(message);
            } else {
                throw new Error();
            }
        };
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    jasmine.getEnv().afterEach(() => {
        // eslint-disable-next-line no-console
        console.error = originalError;
    });
}

export async function waitForAsync(conditionFn: () => boolean): Promise<void> {
    while (!conditionFn()) {
        // eslint-disable-next-line no-await-in-loop
        await waitAsync();
    }
}

export async function waitAsync(): Promise<void> {
    await new Promise(window.requestAnimationFrame);
}