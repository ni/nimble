/* eslint-disable func-names */
/* eslint-disable no-undef */

/**
 * Register the custom event types used by Nimble components.
 *
 * JavaScript initializer for NimbleBlazor project, see
 * https://learn.microsoft.com/en-us/aspnet/core/blazor/javascript-interoperability/?view=aspnetcore-8.0 and
 * https://learn.microsoft.com/en-us/aspnet/core/blazor/fundamentals/startup?view=aspnetcore-8.0
 */

function registerNimbleEvents(Blazor) {
    if (window.NimbleBlazor.hasRegisteredEvents) {
        console.warn('Attempted to register Nimble Blazor events multiple times!'); // eslint-disable-line
        return;
    }

    if (!Blazor) {
        throw new Error('Blazor not ready to initialize Nimble with!');
    }

    window.NimbleBlazor.hasRegisteredEvents = true;

    // Used by NimbleCheckbox.razor, NimbleSwitch.razor, NimbleToggleButton.razor
    // Necessary because the control's value property is always just the value 'on', so we need to look
    // at the checked property to correctly get the value.
    Blazor.registerCustomEventType('nimblecheckedchange', {
        browserEventName: 'change',
        createEventArgs: event => {
            return {
                checked: event.target.currentChecked
            };
        }
    });
    // Used by NimbleTabs.razor
    // Necessary because the tab control uses a 'change' event but not a value/currentValue property,
    // and we do want to be notified of activeid changes (via the change event) for 2-way binding support.
    // 'localName' check is required to guard against children's change event trickling into the NimbleTabs.
    Blazor.registerCustomEventType('nimbletabsactiveidchange', {
        browserEventName: 'change',
        createEventArgs: event => {
            if (event.target.localName === 'nimble-tabs') {
                return {
                    activeId: event.target.activeid
                };
            }
            return null;
        }
    });
    // Used by NimbleMenuButton.razor
    Blazor.registerCustomEventType('nimblemenubuttontoggle', {
        browserEventName: 'toggle',
        createEventArgs: event => {
            return {
                newState: event.detail.newState,
                oldState: event.detail.oldState
            };
        }
    });
    // Used by NimbleMenuButton.razor
    Blazor.registerCustomEventType('nimblemenubuttonbeforetoggle', {
        browserEventName: 'beforetoggle',
        createEventArgs: event => {
            return {
                newState: event.detail.newState,
                oldState: event.detail.oldState
            };
        }
    });
    // Used by NimbleBanner.razor
    Blazor.registerCustomEventType('nimblebannertoggle', {
        browserEventName: 'toggle',
        createEventArgs: event => {
            return {
                newState: event.detail.newState,
                oldState: event.detail.oldState
            };
        }
    });
    // Used by NimbleTable.razor
    Blazor.registerCustomEventType('nimbleactionmenubeforetoggle', {
        browserEventName: 'action-menu-beforetoggle',
        createEventArgs: event => {
            return {
                newState: event.detail.newState,
                oldState: event.detail.oldState,
                recordIds: event.detail.recordIds,
                columnId: event.detail.columnId
            };
        }
    });
    // Used by NimbleTable.razor
    Blazor.registerCustomEventType('nimbleactionmenutoggle', {
        browserEventName: 'action-menu-toggle',
        createEventArgs: event => {
            return {
                newState: event.detail.newState,
                oldState: event.detail.oldState,
                recordIds: event.detail.recordIds,
                columnId: event.detail.columnId
            };
        }
    });
    // Used by NimbleTable.razor
    Blazor.registerCustomEventType('nimbletablerowselectionchange', {
        browserEventName: 'selection-change',
        createEventArgs: event => {
            return {
                selectedRecordIds: event.detail.selectedRecordIds
            };
        }
    });
    // Used by NimbleTable.razor
    Blazor.registerCustomEventType('nimbletablecolumnconfigurationchange', {
        browserEventName: 'column-configuration-change',
        createEventArgs: event => {
            return {
                columns: event.detail.columns
            };
        }
    });
    // Used by NimbleTable.razor
    Blazor.registerCustomEventType('nimbletablerowexpandtoggle', {
        browserEventName: 'row-expand-toggle',
        createEventArgs: event => {
            return {
                recordId: event.detail.recordId,
                newState: event.detail.newState,
                oldState: event.detail.oldState
            };
        }
    });
    // Used by NimbleTableColumnMenuButton.razor
    Blazor.registerCustomEventType('nimbletablecolumnmenubuttonbeforetoggle', {
        browserEventName: 'menu-button-column-beforetoggle',
        createEventArgs: event => {
            return {
                recordId: event.detail.recordId,
                newState: event.detail.newState,
                oldState: event.detail.oldState
            };
        }
    });
    // Used by NimbleTableColumnMenuButton.razor
    Blazor.registerCustomEventType('nimbletablecolumnmenubuttontoggle', {
        browserEventName: 'menu-button-column-toggle',
        createEventArgs: event => {
            return {
                recordId: event.detail.recordId,
                newState: event.detail.newState,
                oldState: event.detail.oldState
            };
        }
    });
    // Used by NimbleWaferMap.razor
    Blazor.registerCustomEventType('nimblewafermapdiehoverchange', {
        browserEventName: 'die-hover',
        createEventArgs: event => {
            return {
                currentDie: event.detail.currentDie
            };
        }
    });
}

function handleRuntimeStarted() {
    window.NimbleBlazor.hasRuntimeStarted = true;
}

// Blazor Web Apps
export function afterWebStarted(Blazor) {
    registerNimbleEvents(Blazor);
    // Note: For static SSR, this is the last event called, and hasRuntimeStarted
    // will remain false.
}

export function afterServerStarted(_Blazor) {
    handleRuntimeStarted();
}

// Blazor Web Apps, WASM Standalone apps with .NET 8
export function afterWebAssemblyStarted(_Blazor) {
    if (!window.NimbleBlazor.hasRegisteredEvents) {
        registerNimbleEvents(Blazor);
    }

    handleRuntimeStarted();
}

// Blazor Server/WebAssembly/Hybrid apps
export function afterStarted(Blazor) {
    // In some cases afterStarted is called on Blazor Web Apps too, if Nimble is used in a component explicitly
    // marked as InteractiveWebAssembly render mode. So check if we've already registered our events first.
    if (!window.NimbleBlazor.hasRegisteredEvents) {
        registerNimbleEvents(Blazor);
    }

    handleRuntimeStarted();
}

if (window.NimbleBlazor) {
    console.warn('Attempting to initialize NimbleBlazor multiple times!'); // eslint-disable-line
}

window.NimbleBlazor = window.NimbleBlazor ?? {
    hasRegisteredEvents: false,
    hasRuntimeStarted: false,
    Dialog: {
        show: async function (dialogReference) {
            const reason = await dialogReference.show();
            return reason === window.customElements.get('nimble-dialog').UserDismissed;
        },
        close: function (dialogReference) {
            dialogReference.close();
        }
    },
    Drawer: {
        show: async function (drawerReference) {
            const reason = await drawerReference.show();
            return reason === window.customElements.get('nimble-drawer').UserDismissed;
        },
        close: function (drawerReference) {
            drawerReference.close();
        }
    },
    Table: {
        setData: async function (tableReference, data) {
            const dataObject = JSON.parse(data);
            await tableReference.setData(dataObject);
        },
        setRecordHierarchyOptions: async function (tableReference, options) {
            // Blazor converts the 'None' delayed hierarchy state to null,
            // but nimble-components expects 'None' to be passed as undefined.
            // Therefore, change any null values to undefined.
            for (const option of options) {
                if (option.options.delayedHierarchyState === null) {
                    option.options.delayedHierarchyState = undefined;
                }
            }
            await tableReference.setRecordHierarchyOptions(options);
        },
        getSelectedRecordIds: async function (tableReference) {
            return await tableReference.getSelectedRecordIds();
        },
        setSelectedRecordIds: async function (tableReference, selectedRecordIds) {
            await tableReference.setSelectedRecordIds(selectedRecordIds);
        },
        checkValidity: function (tableReference) {
            return tableReference.checkValidity();
        },
        getValidity: function (tableReference) {
            return tableReference.validity;
        }
    },
    ThemeProvider: {
        checkValidity: function (themeProviderReference) {
            return themeProviderReference.checkValidity();
        },
        getValidity: function (themeProviderReference) {
            return themeProviderReference.validity;
        }
    },
    WaferMap: {
        getValidity: function (waferMapReference) {
            return waferMapReference.validity;
        },
        setDies: async function (waferMapReference, data) {
            const diesObject = JSON.parse(data);
            await waferMapReference.setData(diesObject);
        },
        setDiesTable: async function (waferMapReference, data) {
            const tableFromIPC = window.customElements.get('nimble-wafer-map').Arrow.tableFromIPC;
            const table = tableFromIPC(data);
            await waferMapReference.setData(table);
        },

        setColorScale: function (waferMapReference, data) {
            const colorScaleObject = JSON.parse(data);
            waferMapReference.colorScale = colorScaleObject;
        },
        setHighlightedTags: function (waferMapReference, data) {
            const highlightedTagsObject = JSON.parse(data);
            waferMapReference.highlightedTags = highlightedTagsObject;
        }
    }
};
