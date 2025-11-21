import { Banner } from '@ni/nimble-components/dist/esm/banner';
import type { BannerToggleEventDetail } from '@ni/nimble-components/dist/esm/banner/types';
import { wrap, type EventName } from '../utilities/react-wrapper';

export { type Banner };
export const NimbleBanner = wrap(Banner, {
    events: {
        onToggle: 'toggle' as EventName<BannerToggleEvent>,
    }
});
export interface BannerToggleEvent extends CustomEvent<BannerToggleEventDetail> {
    target: Banner;
}
