import { forklift16X16 } from '@ni/nimble-tokens/dist/icons/js';
import { IconSvg } from '@ni/nimble-components/dist/esm/icon-svg';
import { template } from '@ni/nimble-components/dist/esm/icon-svg/template';
import { DesignSystem } from '@ni/fast-foundation';
import { styles } from './styles';

declare global {
    interface HTMLElementTagNameMap {
        'spright-icon-work-item-forklift': IconWorkItemForklift;
    }
}

/**
 * Spright forklift icon for transport order work items
 */
export class IconWorkItemForklift extends IconSvg {
    public constructor() {
        super(forklift16X16);
    }
}

const sprightIconWorkItemForklift = IconWorkItemForklift.compose({
    baseName: 'icon-work-item-forklift',
    template,
    styles
});

DesignSystem.getOrCreate()
    .withPrefix('spright')
    .register(sprightIconWorkItemForklift());

export const iconWorkItemForkliftTag = 'spright-icon-work-item-forklift';
