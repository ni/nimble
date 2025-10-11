import { ToggleButton } from '@ni/nimble-components/dist/esm/toggle-button';
import { wrap, type EventName } from '../utilities/react-wrapper';

export { type ToggleButton };
export const NimbleToggleButton = wrap(ToggleButton, {
    events: {
        onChange: 'change' as EventName<ToggleButtonChangeEvent>,
    }
});
export interface ToggleButtonChangeEvent extends CustomEvent {
    target: ToggleButton;
}
