import {
    attr,
    nullableNumberConverter,
    observable
} from '@microsoft/fast-element';
import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import { template } from './template';
import { styles } from './styles';
import {
    WaferMapColorsScale,
    WaferMapColorsScaleMode,
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
    @attr
    public quadrant: WaferMapQuadrant = WaferMapQuadrant.topLeft;

    @attr
    public orientation: WaferMapOrientation = WaferMapOrientation.top;

    @attr({
        attribute: 'max-characters',
        converter: nullableNumberConverter
    })
    public maxCharacters = 4;

    @attr({
        attribute: 'die-labels-hidden',
        mode: 'boolean'
    })
    public dieLabelsHidden = false;

    @attr({
        attribute: 'die-labels-suffix'
    })
    public dieLabelsSuffix = '';

    @attr({
        attribute: 'colors-scale-mode'
    })
    public colorsScaleMode: WaferMapColorsScaleMode = WaferMapColorsScaleMode.linear;

    @observable public highlightedValues: number[] = [];
    @observable public dies: WaferMapDie[] = [];
    @observable public colorScale: WaferMapColorsScale = {
        colors: [],
        values: []
    };
    @observable public renderReady: boolean = false;

    override connectedCallback() {
        super.connectedCallback();
        //The component has been attached to the DOM and the attributes, properties are available
        //Use this for initialization/initial render

        //Simulate the time required until render is complete, before displaying the wafermap
        //User this for conditional rendering
        setTimeout(()=>{
            this.renderReady=true;
        },2000);
    }

}

const nimbleWaferMap = WaferMap.compose({
    baseName: 'wafer-map',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleWaferMap());
