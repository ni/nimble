import { Banner } from '@ni/nimble-components/dist/esm/banner';
import type { BannerToggleEventDetail } from '@ni/nimble-components/dist/esm/banner/types';
import { wrap } from '../utilities/react-wrapper';

export { type Banner };
export const NimbleBanner = wrap(Banner, {
    events: {
        onToggle: 'toggle',
    }
});
export interface BannerToggleEvent extends CustomEvent<BannerToggleEventDetail> {
    target: Banner;
}
