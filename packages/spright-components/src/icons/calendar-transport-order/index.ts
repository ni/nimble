import { forklift16X16 } from '@ni/nimble-tokens/dist/icons/js';
import { IconSvg } from '@ni/nimble-components/dist/esm/icon-svg';
import { template } from '@ni/nimble-components/dist/esm/icon-svg/template';
import { DesignSystem } from '@ni/fast-foundation';
import { styles } from './styles';

declare global {
    interface HTMLElementTagNameMap {
        'spright-icon-calendar-transport-order': IconCalendarTransportOrder;
    }
}

/**
 * Spright calendar icon for transport order events
 */
export class IconCalendarTransportOrder extends IconSvg {
    public constructor() {
        super(forklift16X16);
    }
}

const sprightIconCalendarTransportOrder = IconCalendarTransportOrder.compose({
    baseName: 'icon-calendar-transport-order',
    template,
    styles
});

DesignSystem.getOrCreate()
    .withPrefix('spright')
    .register(sprightIconCalendarTransportOrder());

export const iconCalendarTransportOrderTag = 'spright-icon-calendar-transport-order';
