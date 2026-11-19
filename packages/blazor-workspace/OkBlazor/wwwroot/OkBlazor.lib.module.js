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
            selectedValues: Array.isArray(event.target?.selectedValues)
                && event.target.selectedValues.every(value => typeof value === 'string') ? event.target.selectedValues : undefined,
            isMultiSelect: event.target?.localName === 'ok-fv-multi-select',
            source: event.target?.getAttribute?.('data-ok-fv-event-source')
        })
    });
    for (const [name, browserEventName] of [
        ['okfveditfilter', 'edit-filter'],
        ['okfvclearfilter', 'clear-filter']
    ]) {
        Blazor.registerCustomEventType(name, {
            browserEventName,
            createEventArgs: event => ({
                query: event.detail?.query,
                source: event.target?.getAttribute?.('data-ok-fv-event-source')
            })
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
        Blazor.registerCustomEventType(name, {
            browserEventName,
            createEventArgs: event => ({ source: event.target?.getAttribute?.('data-ok-fv-event-source') })
        });
    }
    Blazor.registerCustomEventType('okfvtoggle', {
        browserEventName: 'toggle',
        createEventArgs: event => ({
            open: typeof event.detail?.open === 'boolean' ? event.detail.open : undefined,
            source: event.target?.getAttribute?.('data-ok-fv-event-source')
        })
    });
    Blazor.registerCustomEventType('okfvchipchange', {
        browserEventName: 'change',
        createEventArgs: event => ({
            selectedValues: Array.isArray(event.detail?.selectedValues)
                && event.detail.selectedValues.every(value => typeof value === 'string') ? event.detail.selectedValues : undefined,
            source: event.target?.getAttribute?.('data-ok-fv-event-source')
        })
    });
    Blazor.registerCustomEventType('okfvlistchange', {
        browserEventName: 'change',
        createEventArgs: event => ({
            value: typeof event.detail?.value === 'string' ? event.detail.value : null,
            source: event.target?.getAttribute?.('data-ok-fv-event-source')
        })
    });
    for (const [name, browserEventName] of [
        ['okfvpositioninput', 'input'],
        ['okfvpositionchange', 'change']
    ]) {
        Blazor.registerCustomEventType(name, {
            browserEventName,
            createEventArgs: event => ({
                position: typeof event.target?.position === 'number' && Number.isFinite(event.target.position)
                    ? event.target.position : undefined,
                source: event.target?.getAttribute?.('data-ok-fv-event-source')
            })
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
        element[name] = (name === 'message' || name === 'maskOptions') && value === null ? undefined : value;
    },
    TsIconDynamic: {
        registerIconDynamic: function (tagName, url) {
            const registerIconDynamic = window.customElements.get('ok-ts-icon-dynamic').registerIconDynamic;
            registerIconDynamic(tagName, url);
        }
    }
};
