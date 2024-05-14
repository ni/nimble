/* eslint-disable func-names */
/* eslint-disable no-undef */

/**
 * Register the custom event types used by Spright components.
 *
 * JavaScript initializer for SprightBlazor project, see
 * https://docs.microsoft.com/en-us/aspnet/core/blazor/javascript-interoperability/?view=aspnetcore-6.0#javascript-initializers
 */

export function afterStarted(Blazor) {
    if (window.SprightBlazor.calledAfterStarted) {
        console.warn('Attempted to initialize Spright Blazor multiple times!'); // eslint-disable-line
        return;
    }

    if (!Blazor) {
        throw new Error('Blazor not ready to initialize Spright with!');
    }

    window.SprightBlazor.calledAfterStarted = true;

    /* Register any custom events here
    Blazor.registerCustomEventType('sprighteventname', {
        browserEventName: 'foo',
        createEventArgs: event => {
            return {
                newState: event.detail.newState,
                oldState: event.detail.oldState
            };
        }
    });
    */
}

if (window.SprightBlazor) {
    console.warn('Attempting to initialize SprightBlazor multiple times!'); // eslint-disable-line
}

window.SprightBlazor = window.SprightBlazor ?? {
    calledAfterStarted: false
};
