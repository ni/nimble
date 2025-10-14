import { RadioGroup } from '@ni/nimble-components/dist/esm/radio-group';
import { wrap, type EventName } from '../utilities/react-wrapper';

export { type RadioGroup };
export const NimbleRadioGroup = wrap(RadioGroup, {
    events: {
        onChange: 'change' as EventName<RadioGroupChangeEvent>,
    }
});
export interface RadioGroupChangeEvent extends CustomEvent {
    target: RadioGroup;
}
