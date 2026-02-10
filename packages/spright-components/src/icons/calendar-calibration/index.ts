import { calipers16X16 } from '@ni/nimble-tokens/dist/icons/js';
import { IconSvg } from '@ni/nimble-components/dist/esm/icon-svg';
import { template } from '@ni/nimble-components/dist/esm/icon-svg/template';
import { DesignSystem } from '@ni/fast-foundation';
import { styles } from './styles';

declare global {
    interface HTMLElementTagNameMap {
        'spright-icon-calendar-calibration': IconCalendarCalibration;
    }
}

/**
 * Custom Spright icon for calendar calibration using calipers SVG
 * with calendar event border color
 */
export class IconCalendarCalibration extends IconSvg {
    public constructor() {
        super(calipers16X16);
    }
}

const sprightIconCalendarCalibration = IconCalendarCalibration.compose({
    baseName: 'icon-calendar-calibration',
    template,
    styles
});

DesignSystem.getOrCreate()
    .withPrefix('spright')
    .register(sprightIconCalendarCalibration());

export const iconCalendarCalibrationTag = 'spright-icon-calendar-calibration';
