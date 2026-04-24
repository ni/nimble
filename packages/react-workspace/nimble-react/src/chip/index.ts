import { Chip, chipTag } from '@ni/nimble-components/dist/esm/chip';
import { wrap, type EventName } from '../utilities/react-wrapper';

export { chipTag };
export { type Chip };
export const NimbleChip = wrap(Chip, {
    events: {
        onRemove: 'remove' as EventName<ChipRemoveEvent>,
        onSelectedChange: 'selected-change' as EventName<ChipSelectedChangeEvent>,
    }
});
export interface ChipRemoveEvent extends CustomEvent {
    target: Chip;
}

export interface ChipSelectedChangeEvent extends CustomEvent {
    target: Chip;
}
