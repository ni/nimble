/* eslint-disable func-names */
/* eslint-disable no-undef */

/**
 * Register the custom event types used by Demo.Shared components.
 *
 * JavaScript initializer for Demo.Shared project, see
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
        throw new Error('Blazor not ready to initialize Demo.Shared with!');
    }

    hasRegisteredEvents = true;

    // Perform Blazor.registerCustomEventType calls here
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

if (window.DemoShared) {
    console.warn('Attempting to initialize Demo.Shared multiple times!'); // eslint-disable-line
}

window.DemoShared = window.DemoShared ?? {
    isReady: () => isReady,
    PrefersColorScheme: {
        prefersDark: function () {
            let prefersColorSchemeDarkMediaQuery = window.matchMedia(
                '(prefers-color-scheme: dark)'
            );
            const result = prefersColorSchemeDarkMediaQuery.matches;
            return result;
        },
    },
};
