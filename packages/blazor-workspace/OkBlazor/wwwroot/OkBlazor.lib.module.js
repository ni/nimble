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

    Blazor.registerCustomEventType('okfvmultiselectinput', {
        browserEventName: 'input',
        createEventArgs: event => ({
            selectedValues: event.target.selectedValues,
            isMultiSelect: event.target.localName === 'ok-fv-multi-select'
        })
    });
    for (const [name, browserEventName] of [
        ['okfveditfilter', 'edit-filter'],
        ['okfvclearfilter', 'clear-filter']
    ]) {
        Blazor.registerCustomEventType(name, {
            browserEventName,
            createEventArgs: event => ({ query: event.detail?.query })
        });
    }
    for (const [name, browserEventName] of [
        ['okfvsave', 'save'],
        ['okfvrevert', 'revert'],
        ['okfvdismissmessage', 'dismiss-message'],
        ['okfvreset', 'reset'],
        ['okfvclear', 'clear'],
        ['okfvedititems', 'edit-items'],
        ['okfvtrigger', 'trigger']
    ]) {
        Blazor.registerCustomEventType(name, { browserEventName, createEventArgs: () => ({}) });
    }
    Blazor.registerCustomEventType('okfvtoggle', {
        browserEventName: 'toggle',
        createEventArgs: event => ({ open: event.detail?.open })
    });
    Blazor.registerCustomEventType('okfvchipchange', {
        browserEventName: 'change',
        createEventArgs: event => ({ selectedValues: event.detail?.selectedValues })
    });
    Blazor.registerCustomEventType('okfvlistchange', {
        browserEventName: 'change',
        createEventArgs: event => ({ value: event.detail?.value })
    });
    for (const [name, browserEventName] of [
        ['okfvpositioninput', 'input'],
        ['okfvpositionchange', 'change']
    ]) {
        Blazor.registerCustomEventType(name, {
            browserEventName,
            createEventArgs: event => ({ position: event.target.position, source: event.target.localName })
        });
    }

    Blazor.registerCustomEventType('okbreakpointcolumntoggle', {
        browserEventName: 'breakpoint-column-toggle',
        createEventArgs: event => {
            return {
                recordId: event.detail.recordId,
                newState: event.detail.newState,
                oldState: event.detail.oldState
            };
        }
    });

    Blazor.registerCustomEventType('okbreakpointcolumnstatechangerequested', {
        browserEventName: 'breakpoint-column-state-change-requested',
        createEventArgs: event => {
            return {
                recordId: event.detail.recordId,
                currentState: event.detail.currentState,
                requestedState: event.detail.requestedState
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

if (window.OkBlazor) {
    console.warn('Attempting to initialize OkBlazor multiple times!'); // eslint-disable-line
}

window.OkBlazor = window.OkBlazor ?? {
    isReady: () => isReady,
    setProperty: (element, name, value) => {
        element[name] = value;
    },
    TsIconDynamic: {
        registerIconDynamic: function (tagName, url) {
            const registerIconDynamic = window.customElements.get('ok-ts-icon-dynamic').registerIconDynamic;
            registerIconDynamic(tagName, url);
        }
    }
};
