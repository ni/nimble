import { Combobox } from '@ni/nimble-components/dist/esm/combobox';
import { wrap } from '../utilities/react-wrapper';

export const NimbleCombobox = wrap(Combobox, {
    events: {
        onChange: 'change',
        onInput: 'input'
    }
});
