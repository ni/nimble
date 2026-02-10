import { calendarWeek16X16 } from '@ni/nimble-tokens/dist/icons/js';
import { IconSvg } from '@ni/nimble-components/dist/esm/icon-svg';
import { template } from '@ni/nimble-components/dist/esm/icon-svg/template';
import { DesignSystem } from '@ni/fast-foundation';
import { styles } from './styles';

declare global {
    interface HTMLElementTagNameMap {
        'spright-icon-calendar-reservation': IconCalendarReservation;
    }
}

/**
 * Custom Spright icon for calendar reservation using calendar-week SVG
 * with calendar event border color
 */
export class IconCalendarReservation extends IconSvg {
    public constructor() {
        super(calendarWeek16X16);
    }
}

const sprightIconCalendarReservation = IconCalendarReservation.compose({
    baseName: 'icon-calendar-reservation',
    template,
    styles
});

DesignSystem.getOrCreate()
    .withPrefix('spright')
    .register(sprightIconCalendarReservation());

export const iconCalendarReservationTag = 'spright-icon-calendar-reservation';
