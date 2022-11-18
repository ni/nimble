import { attr } from '@microsoft/fast-element';
import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import { template } from '../theme-provider/template';
import { styles } from './styles';
import {
    WaferMapColorBy,
    WaferMapColorsScale,
    WaferMapDataType,
    WaferMapDie,
    WaferMapOrientation,
    WaferMapQuadrant
} from './types';

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
        attribute: 'wafer-quadrant'
    })
    public waferQuadrant!: WaferMapQuadrant;

    @attr({
        attribute: 'wafer-orientation'
    })
    public waferOrientation!: WaferMapOrientation;

    @attr({
        attribute: 'max-characters'
    })
    public maxCharacters!: number;

    @attr({
        attribute: 'wafer-datatype'
    })
    public waferDataType!: WaferMapDataType;

    @attr({
        attribute: 'colorBy'
    })
    public colorBy: WaferMapColorBy = WaferMapColorBy.hardBin;

    @attr({
        attribute: 'highlighted-values'
    })
    public highlightedValues!: string[];

    public dice!: WaferMapDie[];
    public colorsScale!: WaferMapColorsScale;
}

const nimbleWaferMap = WaferMap.compose({
    baseName: 'wafer-map',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleWaferMap());
