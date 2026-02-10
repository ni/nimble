import { wrenchHammer16X16 } from '@ni/nimble-tokens/dist/icons/js';
import { IconSvg } from '@ni/nimble-components/dist/esm/icon-svg';
import { template } from '@ni/nimble-components/dist/esm/icon-svg/template';
import { DesignSystem } from '@ni/fast-foundation';
import { styles } from './styles';

declare global {
    interface HTMLElementTagNameMap {
        'spright-icon-calendar-maintenance': IconCalendarMaintenance;
    }
}

/**
 * Custom Spright icon for calendar maintenance using wrench-hammer SVG
 * with calendar event border color
 */
export class IconCalendarMaintenance extends IconSvg {
    public constructor() {
        super(wrenchHammer16X16);
    }
}

const sprightIconCalendarMaintenance = IconCalendarMaintenance.compose({
    baseName: 'icon-calendar-maintenance',
    template,
    styles
});

DesignSystem.getOrCreate()
    .withPrefix('spright')
    .register(sprightIconCalendarMaintenance());

export const iconCalendarMaintenanceTag = 'spright-icon-calendar-maintenance';
