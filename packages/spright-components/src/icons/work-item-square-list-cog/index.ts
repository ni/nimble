import { squareListCog16X16 } from '@ni/nimble-tokens/dist/icons/js';
import { IconSvg } from '@ni/nimble-components/dist/esm/icon-svg';
import { template } from '@ni/nimble-components/dist/esm/icon-svg/template';
import { DesignSystem } from '@ni/fast-foundation';
import { styles } from './styles';

declare global {
    interface HTMLElementTagNameMap {
        'spright-icon-work-item-square-list-cog': IconWorkItemSquareListCog;
    }
}

/**
 * Spright square list cog icon for work order items
 */
export class IconWorkItemSquareListCog extends IconSvg {
    public constructor() {
        super(squareListCog16X16);
    }
}

const sprightIconWorkItemSquareListCog = IconWorkItemSquareListCog.compose({
    baseName: 'icon-work-item-square-list-cog',
    template,
    styles
});

DesignSystem.getOrCreate()
    .withPrefix('spright')
    .register(sprightIconWorkItemSquareListCog());

export const iconWorkItemSquareListCogTag = 'spright-icon-work-item-square-list-cog';
