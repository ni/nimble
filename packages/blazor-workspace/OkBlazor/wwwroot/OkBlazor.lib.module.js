/* eslint-disable func-names */
/* eslint-disable no-undef */

/**
 * Register the custom event types used by Ok components.
 *
 * JavaScript initializer for OkBlazor project, see
 * https://learn.microsoft.com/en-us/aspnet/core/blazor/javascript-interoperability/?view=aspnetcore-8.0 and
 * https://learn.microsoft.com/en-us/aspnet/core/blazor/fundamentals/startup?view=aspnetcore-8.0
 */

let hasRegisteredEvents = false;
let isReady = false;

function registerEvents(Blazor) {
    if (hasRegisteredEvents) {
        return;
    }

    if (!Blazor) {
        throw new Error('Blazor not ready to initialize OkBlazor with!');
    }

    hasRegisteredEvents = true;

    /* Register any custom events here
    Blazor.registerCustomEventType('okeventname', {
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
    isReady = true;
}

// Blazor Web Apps
export function afterWebStarted(Blazor) {
    registerEvents(Blazor);
}

// Blazor Web Apps using InteractiveServer render mode
export function afterServerStarted(_Blazor) {
    handleRuntimeStarted();
}

// Blazor Web Apps using InteractiveWebAssembly render mode; WASM Standalone apps
export function afterWebAssemblyStarted(_Blazor) {
    registerEvents(Blazor);
    handleRuntimeStarted();
}

// Blazor Hybrid apps
export function afterStarted(Blazor) {
    registerEvents(Blazor);
    handleRuntimeStarted();
}

if (window.OkBlazor) {
    console.warn('Attempting to initialize OkBlazor multiple times!'); // eslint-disable-line
}

window.OkBlazor = window.OkBlazor ?? {
    isReady: () => isReady
};
