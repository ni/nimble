/**
 * Register the custom event types used by Nimble components.
 *
 * JavaScript initializer for NimbleBlazor project, see
 * https://docs.microsoft.com/en-us/aspnet/core/blazor/javascript-interoperability/?view=aspnetcore-6.0#javascript-initializers
 */
export function afterStarted(Blazor) {
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
    Blazor.registerCustomEventType('nimbletabsactiveidchange', {
        browserEventName: 'change',
        createEventArgs: event => {
            return {
                activeId: event.target.activeid
            };
        }
    });
    // Used by NimbleDrawer.razor
    Blazor.registerCustomEventType('nimbledrawerstatechange', {
        browserEventName: 'state-change',
        createEventArgs: event => {
            return {
                state: event.target.state
            };
        }
    });
    // Used by NimbleMenuButton.razor
    Blazor.registerCustomEventType('nimblemenubuttonopenchange', {
        browserEventName: 'open-change',
        createEventArgs: event => {
            return {
                open: event.target.open
            };
        }
    });
    // Used by NimbleCombobox.razor
    Blazor.registerCustomEventType('nimblecomboboxinput', {
        browserEventName: 'input',
        createEventArgs: event => {
            return {
                value: event.target.control.value
            };
        }
    });
}