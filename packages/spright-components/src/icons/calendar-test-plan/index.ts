import { rectangleCheckLines16X16 } from '@ni/nimble-tokens/dist/icons/js';
import { IconSvg } from '@ni/nimble-components/dist/esm/icon-svg';
import { template } from '@ni/nimble-components/dist/esm/icon-svg/template';
import { DesignSystem } from '@ni/fast-foundation';
import { styles } from './styles';

declare global {
    interface HTMLElementTagNameMap {
        'spright-icon-calendar-test-plan': IconCalendarTestPlan;
    }
}

/**
 * Spright calendar icon for test plan events
 */
export class IconCalendarTestPlan extends IconSvg {
    public constructor() {
        super(rectangleCheckLines16X16);
    }
}

const sprightIconCalendarTestPlan = IconCalendarTestPlan.compose({
    baseName: 'icon-calendar-test-plan',
    template,
    styles
});

DesignSystem.getOrCreate()
    .withPrefix('spright')
    .register(sprightIconCalendarTestPlan());

export const iconCalendarTestPlanTag = 'spright-icon-calendar-test-plan';
