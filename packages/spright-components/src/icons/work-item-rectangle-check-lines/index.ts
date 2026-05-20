import { rectangleCheckLines16X16 } from '@ni/nimble-tokens/dist/icons/js';
import { IconSvg } from '@ni/nimble-components/dist/esm/icon-svg';
import { template } from '@ni/nimble-components/dist/esm/icon-svg/template';
import { DesignSystem } from '@ni/fast-foundation';
import { styles } from './styles';

declare global {
    interface HTMLElementTagNameMap {
        'spright-icon-work-item-rectangle-check-lines': IconWorkItemRectangleCheckLines;
    }
}

/**
 * Spright rectangle check lines icon for test plan work items
 */
export class IconWorkItemRectangleCheckLines extends IconSvg {
    public constructor() {
        super(rectangleCheckLines16X16);
    }
}

const sprightIconWorkItemRectangleCheckLines = IconWorkItemRectangleCheckLines.compose({
    baseName: 'icon-work-item-rectangle-check-lines',
    template,
    styles
});

DesignSystem.getOrCreate()
    .withPrefix('spright')
    .register(sprightIconWorkItemRectangleCheckLines());

export const iconWorkItemRectangleCheckLinesTag = 'spright-icon-work-item-rectangle-check-lines';
