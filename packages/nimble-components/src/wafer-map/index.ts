import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import { template } from '../theme-provider/template';
import { WaferMapColorsScale } from './data-types/WaferMapColorsScale';
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
    public waferData: WaferMapRenderingObject | undefined;

    public colorBy: WaferColorByOptions = 0;

    public highlightedValues!: string[];

    public colorsScale: WaferMapColorsScale = new WaferMapColorsScale(['red', 'green'], ['0', '1']);

    public override connectedCallback(): void {
        super.connectedCallback();
        // if (this.waferData === undefined) return;
        // debugger;
    }
}

const nimbleWaferMap = WaferMap.compose({
    baseName: 'wafer-map',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleWaferMap());
