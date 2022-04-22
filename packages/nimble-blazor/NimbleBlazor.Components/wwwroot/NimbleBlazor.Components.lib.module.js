/**
 * Register the custom event type used for the NimbleCheckbox and NimbleSwitch change events.
 * Necessary because the control's value property is always just the value 'on', so we need to look
 * at the checked property to correctly get the value.
 * @see NimbleCheckbox.razor and NimbleSwitch.razor
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