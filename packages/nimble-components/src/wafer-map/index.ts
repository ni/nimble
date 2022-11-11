import { attr } from '@microsoft/fast-element';
import {
    DesignSystem,
    FoundationElement
} from '@microsoft/fast-foundation';
import { template } from '../theme-provider/template';
import type { WaferMapColorsScale } from './data-types/WaferMapColorsScale';
import type { WaferMapRenderingObject } from './data-types/WaferMapRenderingObject';
import { styles } from './styles';
import type { WaferColorByOptions } from './types';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-wafer-map': WaferMap;
    }
}

/**
 * A nimble-styled WaferMap
 */
export class WaferMap extends FoundationElement {
    @attr({
        attribute: 'waferData'
    })
    public waferData!: WaferMapRenderingObject;

    @attr({
        attribute: 'colorBy'
    })
    public colorBy: WaferColorByOptions = 0;

    @attr({
        attribute: 'highlightedValues'
    })
    public highlightedValues!: string[];

    @attr({
        attribute: 'colorsScale'
    })
    public colorsScale!: WaferMapColorsScale;
}

const nimbleWaferMap = WaferMap.compose({
    baseName: 'wafer-map',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleWaferMap());
