/* eslint-disable func-names */
/* eslint-disable no-undef */

/**
 * Register the custom event types used by Spright components.
 *
 * JavaScript initializer for SprightBlazor project, see
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

    Blazor.registerCustomEventType('sprightchatinputsend', {
        browserEventName: 'send',
        createEventArgs: event => {
            return {
                text: event.target.value
            };
        }
    });
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

if (window.SprightBlazor) {
    console.warn('Attempting to initialize SprightBlazor multiple times!'); // eslint-disable-line
}

window.SprightBlazor = window.SprightBlazor ?? {
    isReady: () => isReady
};
