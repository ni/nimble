import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import { template } from '../theme-provider/template';
import { WaferMapColorsScale } from './data-types/WaferMapColorsScale';
import type { WaferMapRenderingObject } from './data-types/WaferMapRenderingObject';
import { Data } from './modules/data.module';
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
    public waferData: WaferMapRenderingObject | undefined;

    public highlightedValues: number[] = [];

    public colorsScale: WaferMapColorsScale = new WaferMapColorsScale(['green'], []);

    public isContinuous = true;

    public showDieLabels = true;

    public dieLabelsSuffix = '';

    public maxCharacters = 0;

    private dataModule: Data | undefined;

    public override connectedCallback(): void {
        super.connectedCallback();
        if (this.waferData === undefined) return;
        this.dataModule = new Data(
            this.waferData.dice,
            this.colorsScale,
            this.highlightedValues,
            this.waferData.metadata.axisLocation,
            this.isContinuous,
            this.showDieLabels,
            this.dieLabelsSuffix,
            this.maxCharacters,
            { width: this.offsetWidth, height: this.offsetHeight }
        );
        // debugger;
    }
}

const nimbleWaferMap = WaferMap.compose({
    baseName: 'wafer-map',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleWaferMap());
