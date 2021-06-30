// Workaround for https://github.com/angular/angular-cli/issues/18177
// Capture runtime error logs and convert them to exceptions

{
    let originalError: typeof console.error;

    jasmine.getEnv().beforeEach(() => {
        // eslint-disable-next-line no-console
        originalError = console.error;
        // eslint-disable-next-line no-console
        console.error = (message): void => {
            throw new Error(message);
        };
    });

    jasmine.getEnv().afterEach(() => {
        // eslint-disable-next-line no-console
        console.error = originalError;
    });
}
