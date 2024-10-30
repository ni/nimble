/* eslint-disable func-names */
/* eslint-disable no-undef */

/**
 * Register the custom event types used by Spright components.
 *
 * JavaScript initializer for SprightBlazor project, see
 * https://learn.microsoft.com/en-us/aspnet/core/blazor/javascript-interoperability/?view=aspnetcore-8.0 and
 * https://learn.microsoft.com/en-us/aspnet/core/blazor/fundamentals/startup?view=aspnetcore-8.0
 */

const initializer = (function () {
    let hasRegisteredEvents = false;

    function registerEvents(Blazor) {
        if (hasRegisteredEvents) {
            return;
        }

        if (!Blazor) {
            throw new Error('Blazor not ready to initialize Spright with!');
        }

        hasRegisteredEvents = true;

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

    function handleRuntimeStarted() {
        window.SprightBlazor.isInitialized = true;
    }

    return {
        registerEvents,
        handleRuntimeStarted
    };
}());

// Blazor Web Apps
export function afterWebStarted(Blazor) {
    initializer.registerEvents(Blazor);
}

// Blazor Web Apps using InteractiveServer render mode
export function afterServerStarted(_Blazor) {
    initializer.handleRuntimeStarted();
}

// Blazor Web Apps using InteractiveWebAssembly render mode; WASM Standalone apps
export function afterWebAssemblyStarted(_Blazor) {
    initializer.registerEvents(Blazor);
    initializer.handleRuntimeStarted();
}

// Blazor Hybrid apps
export function afterStarted(Blazor) {
    initializer.registerEvents(Blazor);
    initializer.handleRuntimeStarted();
}

if (window.SprightBlazor) {
    console.warn('Attempting to initialize SprightBlazor multiple times!'); // eslint-disable-line
}

window.SprightBlazor = window.SprightBlazor ?? {
    isInitialized: false
};
