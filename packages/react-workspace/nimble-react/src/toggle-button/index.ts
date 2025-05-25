import { ToggleButton } from '@ni/nimble-components/dist/esm/toggle-button';
import { wrap } from '../utilities/react-wrapper';

export const NimbleToggleButton = wrap(ToggleButton, {
    events: {
        onChange: 'change',
    }
});

export interface ToggleButtonChangeEvent extends CustomEvent {
    target: ToggleButton;
}
