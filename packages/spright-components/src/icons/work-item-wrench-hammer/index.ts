import { wrenchHammer16X16 } from '@ni/nimble-tokens/dist/icons/js';
import { IconSvg } from '@ni/nimble-components/dist/esm/icon-svg';
import { template } from '@ni/nimble-components/dist/esm/icon-svg/template';
import { DesignSystem } from '@ni/fast-foundation';
import { styles } from './styles';

declare global {
    interface HTMLElementTagNameMap {
        'spright-icon-work-item-wrench-hammer': IconWorkItemWrenchHammer;
    }
}

/**
 * Spright wrench hammer icon for maintenance work items
 */
export class IconWorkItemWrenchHammer extends IconSvg {
    public constructor() {
        super(wrenchHammer16X16);
    }
}

const sprightIconWorkItemWrenchHammer = IconWorkItemWrenchHammer.compose({
    baseName: 'icon-work-item-wrench-hammer',
    template,
    styles
});

DesignSystem.getOrCreate()
    .withPrefix('spright')
    .register(sprightIconWorkItemWrenchHammer());

export const iconWorkItemWrenchHammerTag = 'spright-icon-work-item-wrench-hammer';
