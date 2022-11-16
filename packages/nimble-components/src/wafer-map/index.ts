import { attr } from '@microsoft/fast-element';
import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import { template } from '../theme-provider/template';
import type { WaferMapRenderingObject } from './models/wafer-map-rendering-object';
import { styles } from './styles';
import { WaferMapColorBy, WaferMapColorsScale } from './types';

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
    public colorBy: WaferMapColorBy = WaferMapColorBy.hardBin;

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
