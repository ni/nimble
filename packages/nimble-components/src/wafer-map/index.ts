import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import { ScaleLinear, scaleLinear, ScaleBand, scaleBand, ScaleOrdinal, scaleOrdinal } from 'd3-scale';
import { template } from '../theme-provider/template';
import { AxisAttributes } from './data-types/AxisAttributes';
import { WaferMapColorsScale } from './data-types/WaferMapColorsScale';
import type { WaferMapMetadata } from './data-types/WaferMapMetadata';
import type { WaferMapRenderingObject } from './data-types/WaferMapRenderingObject';
import { styles } from './styles';
import { Quadrant, WaferColorByOptions } from './types';

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

    private readonly width = 0;
    private readonly height = 0;

    private gridWidth = 0;
    private gridHeight = 0;

    private xScale!: ScaleLinear<number, number>;
    private yScale!: ScaleLinear<number, number>;

    private xScaleBand!: ScaleBand<number>;
    private yScaleBand!: ScaleBand<number>;

    private colorScale!: ScaleOrdinal<string, string> | ScaleLinear<string, string>;

    private axis: { x: AxisAttributes, y: AxisAttributes } = { x: new AxisAttributes(), y: new AxisAttributes() };
    private radius = 0;
    private readonly canvasWidth = 0;
    private labelsFontSize = 0;
    private readonly maxCharacters = 0;
    private readonly fontSizeFactor = 0;
    private dataLabelsSuffix = '';

    public override connectedCallback(): void {
        super.connectedCallback();
        if (this.waferData === undefined) return;
        // debugger;
        this.axis = this.setAxesAttributes(this.waferData.metadata);
    }

    private buildScales(metadata: WaferMapMetadata): void {
        this.xScale = scaleLinear()
            .domain(this.axis.x.scaleDomain)
            .range(this.axis.x.scaleRange);

        this.xScaleBand = scaleBand<number>()
            .align(0.5)
            .padding(0)
            .domain(this.xScale.ticks(metadata.cols))
            .range([0, this.width]);

        this.yScale = scaleLinear()
            .domain(this.axis.y.scaleDomain)
            .range(this.axis.y.scaleRange);

        this.yScaleBand = scaleBand<number>()
            .align(0.5)
            .padding(0)
            .domain(this.yScale.ticks(metadata.rows))
            .range([0, this.height]);

        this.createColorScale();
        this.gridWidth = this.xScaleBand.bandwidth();
        this.gridHeight = this.yScaleBand.bandwidth();

        this.radius = (this.width / 2) + this.gridWidth * 1.5;
        // if (this.radius > this.canvasWidth / 2) {
        //     this.adjustSize(this.radius - this.canvasWidth / 2);
        // }

        this.labelsFontSize = Math.min(this.gridHeight, this.gridWidth / (this.maxCharacters * 0.5) * this.fontSizeFactor);
    }

    private createColorScale(): void {
        if (this.waferData /* instanceof WafermapCategoricalRenderingObject */) {
            this.colorScale = scaleOrdinal<string, string>()
                .domain(this.colorsScale.values)
                .range(this.colorsScale.colors);
            this.dataLabelsSuffix = '';
        } else {
            this.colorScale = scaleLinear<string, string>()
                .domain(this.colorsScale.values.map(item => parseInt(item, 10)))
                .range(this.colorsScale.colors);

            if (this.colorBy !== WaferColorByOptions.floatValue) {
                this.dataLabelsSuffix = '%';
            }
        }
    }

    private setAxesAttributes(metadata: WaferMapMetadata): { x: AxisAttributes, y: AxisAttributes } {
        const newAxis = { x: new AxisAttributes(), y: new AxisAttributes() };
        if (this.waferData === undefined) return newAxis;

        switch (metadata.axisLocation) {
            case Quadrant.bottomLeft:
                newAxis.x.scaleRange = [0, this.width];
                newAxis.x.scaleDomain = [metadata.origin.x, metadata.origin.x + metadata.cols];
                newAxis.y.scaleRange = [this.height, 0];
                newAxis.y.scaleDomain = [metadata.origin.y - 1, metadata.origin.y + metadata.rows - 1];
                break;
            case Quadrant.bottomRight:
                newAxis.x.scaleRange = [this.width, 0];
                newAxis.x.scaleDomain = [metadata.origin.x - 1, metadata.origin.x + metadata.cols - 1];
                newAxis.y.scaleRange = [this.height, 0];
                newAxis.y.scaleDomain = [metadata.origin.y - 1, metadata.origin.y + metadata.rows - 1];
                break;
            case Quadrant.topRight:
                newAxis.x.scaleRange = [this.width, 0];
                newAxis.x.scaleDomain = [metadata.origin.x - 1, metadata.origin.x + metadata.cols - 1];
                newAxis.y.scaleRange = [0, this.height];
                newAxis.y.scaleDomain = [metadata.origin.y, metadata.origin.y + metadata.rows];
                break;
            default:
                newAxis.x.scaleRange = [0, this.width];
                newAxis.x.scaleDomain = [metadata.origin.x, metadata.origin.x + metadata.cols];
                newAxis.y.scaleRange = [0, this.height];
                newAxis.y.scaleDomain = [metadata.origin.y, metadata.origin.y + metadata.rows];
                break;
        }

        return newAxis;
    }
}

const nimbleWaferMap = WaferMap.compose({
    baseName: 'wafer-map',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleWaferMap());
