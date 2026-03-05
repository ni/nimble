import { calendarWeek16X16 } from '@ni/nimble-tokens/dist/icons/js';
import { IconSvg } from '@ni/nimble-components/dist/esm/icon-svg';
import { template } from '@ni/nimble-components/dist/esm/icon-svg/template';
import { DesignSystem } from '@ni/fast-foundation';
import { styles } from './styles';

declare global {
    interface HTMLElementTagNameMap {
        'spright-icon-work-item-calendar-week': IconWorkItemCalendarWeek;
    }
}

/**
 * Spright calendar week icon for reservation work items
 */
export class IconWorkItemCalendarWeek extends IconSvg {
    public constructor() {
        super(calendarWeek16X16);
    }
}

const sprightIconWorkItemCalendarWeek = IconWorkItemCalendarWeek.compose({
    baseName: 'icon-work-item-calendar-week',
    template,
    styles
});

DesignSystem.getOrCreate()
    .withPrefix('spright')
    .register(sprightIconWorkItemCalendarWeek());

export const iconWorkItemCalendarWeekTag = 'spright-icon-work-item-calendar-week';
