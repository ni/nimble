import { userHelmetSafety16X16 } from '@ni/nimble-tokens/dist/icons/js';
import { IconSvg } from '@ni/nimble-components/dist/esm/icon-svg';
import { template } from '@ni/nimble-components/dist/esm/icon-svg/template';
import { DesignSystem } from '@ni/fast-foundation';
import { styles } from './styles';

declare global {
    interface HTMLElementTagNameMap {
        'spright-icon-work-item-user-helmet-safety': IconWorkItemUserHelmetSafety;
    }
}

/**
 * Spright user helmet safety icon for work items
 */
export class IconWorkItemUserHelmetSafety extends IconSvg {
    public constructor() {
        super(userHelmetSafety16X16);
    }
}

const sprightIconWorkItemUserHelmetSafety = IconWorkItemUserHelmetSafety.compose({
    baseName: 'icon-work-item-user-helmet-safety',
    template,
    styles
});

DesignSystem.getOrCreate()
    .withPrefix('spright')
    .register(sprightIconWorkItemUserHelmetSafety());

export const iconWorkItemUserHelmetSafetyTag = 'spright-icon-work-item-user-helmet-safety';
