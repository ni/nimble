// Workaround for https://github.com/angular/angular-cli/issues/18177
// Capture runtime error logs and convert them to exceptions

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace jasmine {
    interface Env {
        afterEach: typeof afterEach;
        beforeEach: typeof beforeEach;
    }
}

{
    let originalError: typeof console.error;

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

    jasmine.getEnv().afterEach(() => {
        // eslint-disable-next-line no-console
        console.error = originalError;
    });
}