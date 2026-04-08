import { Switch, switchTag } from '@ni/nimble-components/dist/esm/switch';
import { wrap, type EventName } from '../utilities/react-wrapper';

export { switchTag };
export { type Switch };
export const NimbleSwitch = wrap(Switch, {
    events: {
        onChange: 'change' as EventName<SwitchChangeEvent>,
    }
});
export interface SwitchChangeEvent extends CustomEvent {
    target: Switch;
}
