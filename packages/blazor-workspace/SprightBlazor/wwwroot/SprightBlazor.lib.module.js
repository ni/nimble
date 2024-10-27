/* eslint-disable func-names */
/* eslint-disable no-undef */

/**
 * Register the custom event types used by Spright components.
 *
 * JavaScript initializer for SprightBlazor project, see
 * https://learn.microsoft.com/en-us/aspnet/core/blazor/javascript-interoperability/?view=aspnetcore-8.0 and
 * https://learn.microsoft.com/en-us/aspnet/core/blazor/fundamentals/startup?view=aspnetcore-8.0
 */

export function registerSprightEvents(Blazor) {
    if (window.SprightBlazor.hasRegisteredEvents) {
        console.warn('Attempted to register Spright Blazor events multiple times!'); // eslint-disable-line
        return;
    }

    if (!Blazor) {
        throw new Error('Blazor not ready to initialize Spright with!');
    }

    window.SprightBlazor.hasRegisteredEvents = true;

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
    window.NimbleBlazor.hasRuntimeStarted = true;
}

// Blazor Web Apps
export function afterWebStarted(Blazor) {
    registerSprightEvents(Blazor);
    // Note: For static SSR, this is the last event called, and hasRuntimeStarted
    // will remain false.
}

export function afterServerStarted(_Blazor) {
    handleRuntimeStarted();
}

export function afterWebAssemblyStarted(_Blazor) {
    handleRuntimeStarted();
}

// Blazor Server/WebAssembly/Hybrid apps
export function afterStarted(Blazor) {
    // In some cases afterStarted is called on Blazor Web Apps too, if Spright is used in a component explicitly
    // marked as InteractiveWebAssembly render mode. So check if we've already registered our events first.
    if (!window.SprightBlazor.hasRegisteredEvents) {
        registerSprightEvents(Blazor);
    }

    handleRuntimeStarted();
}

if (window.SprightBlazor) {
    console.warn('Attempting to initialize SprightBlazor multiple times!'); // eslint-disable-line
}

window.SprightBlazor = window.SprightBlazor ?? {
    hasRegisteredEvents: false,
    hasRuntimeStarted: false,
};
