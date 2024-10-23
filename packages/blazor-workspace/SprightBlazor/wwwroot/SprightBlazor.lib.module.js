/* eslint-disable func-names */
/* eslint-disable no-undef */

/**
 * Register the custom event types used by Spright components.
 *
 * JavaScript initializer for SprightBlazor project, see
 * https://learn.microsoft.com/en-us/aspnet/core/blazor/javascript-interoperability/?view=aspnetcore-8.0 and
 * https://learn.microsoft.com/en-us/aspnet/core/blazor/fundamentals/startup?view=aspnetcore-8.0
 */

export function initializeSprightBlazor(Blazor) {
    if (window.SprightBlazor.hasInitialized) {
        console.warn('Attempted to initialize Spright Blazor multiple times!'); // eslint-disable-line
        return;
    }

    if (!Blazor) {
        throw new Error('Blazor not ready to initialize Spright with!');
    }

    window.SprightBlazor.hasInitialized = true;

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

// Blazor Web Apps
export function beforeWebStart(_Blazor) {
    window.SprightBlazor.isBlazorWebApp = true;
}

export function afterWebStarted(Blazor) {
    initializeSprightBlazor(Blazor);
}

// Blazor Server/WebAssembly/Hybrid apps
export function afterStarted(Blazor) {
    // In some cases afterStarted is called on Blazor Web Apps too, if Spright is used in a component explicitly
    // marked as InteractiveWebAssembly render mode. As long as afterWebStarted was already called, we've already
    // initialized.
    if (window.SprightBlazor.isBlazorWebApp && window.SprightBlazor.hasInitialized) {
        return;
    }
    initializeSprightBlazor(Blazor);
}

if (window.SprightBlazor) {
    console.warn('Attempting to initialize SprightBlazor multiple times!'); // eslint-disable-line
}

window.SprightBlazor = window.SprightBlazor ?? {
    isBlazorWebApp: false,
    hasInitialized: false,
};
