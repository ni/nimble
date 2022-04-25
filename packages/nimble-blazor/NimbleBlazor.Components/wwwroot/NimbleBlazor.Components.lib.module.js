/**
 * Register the custom event type used for the change events for NimbleCheckbox/NimbleSwitch/NimbleToggleButton.
 * Necessary because the control's value property is always just the value 'on', so we need to look
 * at the checked property to correctly get the value.
 * @see NimbleCheckbox.razor, NimbleSwitch.razor, NimbleToggleButton.razor
 */
export function afterStarted(Blazor) {
    Blazor.registerCustomEventType('nimblecheckedchange', {
        browserEventName: 'change',
        createEventArgs: event => {
            return {
                checked: event.target.currentChecked
            };
        }
    });
}