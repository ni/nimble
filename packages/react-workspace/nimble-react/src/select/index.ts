import { Select } from '@ni/nimble-components/dist/esm/select';
import { wrap } from '../utilities/react-wrapper';

export const NimbleSelect = wrap(Select, {
    events: {
        onChange: 'change',
        onFilterInput: 'filter-input',
    }
});
