import { WaferMap } from '@ni/nimble-components/dist/esm/wafer-map';
import { wrap, type EventName } from '../utilities/react-wrapper';

export { type WaferMap };
export const NimbleWaferMap = wrap(WaferMap, {
    events: {
        onDieHover: 'die-hover' as EventName<WaferMapDieHoverEvent>,
    }
});
export interface WaferMapDieHoverEvent extends CustomEvent {
    target: WaferMap;
}
