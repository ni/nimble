import { Switch } from '@ni/nimble-components/dist/esm/switch';
import { wrap } from '../utilities/react-wrapper';

export const NimbleSwitch = wrap(Switch, {
    events: {
        onChange: 'change',
    }
});

export interface SwitchChangeEvent extends CustomEvent {
    target: Switch;
}
