import { Tooltip } from '@ni/nimble-components/dist/esm/tooltip';
import { wrap, type EventName } from '../utilities/react-wrapper';

export { type Tooltip };
export const NimbleTooltip = wrap(Tooltip, {
    events: {
        onDismiss: 'dismiss' as EventName<TooltipDismissEvent>,
    }
});
export interface TooltipDismissEvent extends CustomEvent {
    target: Tooltip;
}
