import { calipers16X16 } from '@ni/nimble-tokens/dist/icons/js';
import { IconSvg } from '@ni/nimble-components/dist/esm/icon-svg';
import { template } from '@ni/nimble-components/dist/esm/icon-svg/template';
import { DesignSystem } from '@ni/fast-foundation';
import { styles } from './styles';

declare global {
    interface HTMLElementTagNameMap {
        'spright-icon-work-item-calipers': IconWorkItemCalipers;
    }
}

/**
 * Spright calipers icon for calibration work items
 */
export class IconWorkItemCalipers extends IconSvg {
    public constructor() {
        super(calipers16X16);
    }
}

const sprightIconWorkItemCalipers = IconWorkItemCalipers.compose({
    baseName: 'icon-work-item-calipers',
    template,
    styles
});

DesignSystem.getOrCreate()
    .withPrefix('spright')
    .register(sprightIconWorkItemCalipers());

export const iconWorkItemCalipersTag = 'spright-icon-work-item-calipers';
