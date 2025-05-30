import { Tooltip } from '@ni/nimble-components/dist/esm/tooltip';
import { wrap } from '../utilities/react-wrapper';

export { type Tooltip };
export const NimbleTooltip = wrap(Tooltip, {
    events: {
        onDismiss: 'dismiss',
    }
});
export interface TooltipDismissEvent extends CustomEvent {
    target: Tooltip;
}
