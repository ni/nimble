import { attr, observable } from '@microsoft/fast-element';
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
        attribute: 'quadrant'
    })
    public quadrant: WaferMapQuadrant = WaferMapQuadrant.topLeft;

    @attr({
        attribute: 'orientation'
    })
    public orientation: WaferMapOrientation = WaferMapOrientation.top;

    @attr({
        attribute: 'max-characters'
    })
    public maxCharacters = 4;

    @attr({
        attribute: 'data-type'
    })
    public dataType: WaferMapDataType = WaferMapDataType.accumulative;

    @attr({
        attribute: 'colorBy'
    })
    public colorBy: WaferMapColorBy = WaferMapColorBy.hardBin;

    @attr({
        attribute: 'highlighted-values'
    })
    public highlightedValues: string[] = [];

    @observable public dies: WaferMapDie[] = [];
    @observable public colorsScale: WaferMapColorsScale = {} as WaferMapColorsScale;
}

const nimbleWaferMap = WaferMap.compose({
    baseName: 'wafer-map',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleWaferMap());
