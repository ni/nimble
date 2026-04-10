import { Chip, chipTag } from '@ni/nimble-components/dist/esm/chip';
import { wrap, type EventName } from '../utilities/react-wrapper';

export { chipTag };
export { type Chip };
export const NimbleChip = wrap(Chip, {
    events: {
        onRemove: 'remove' as EventName,
    }
});
