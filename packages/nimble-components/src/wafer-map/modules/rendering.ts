import type { WaferMap } from '..';
import { DieRenderInfo, Dimensions, HoverDieOpacity } from '../types';

/**
 * Responsible for drawing the dies inside the wafer map, adding dieText and scaling the canvas
 */
export class RenderingModule {
    private readonly dies: DieRenderInfo[];
    private readonly dimensions: Dimensions;
    private readonly labelFontSize: number;

    public constructor(private readonly wafermap: WaferMap) {
        this.dies = wafermap.dataManager!.diesRenderInfo;
        this.dimensions = wafermap.dataManager!.dieDimensions;
        this.labelFontSize = wafermap.dataManager!.labelsFontSize;
    }

    public drawWafer(): void {
        // this.wafermap.canvasContext.save();
        // this.clearCanvas();
        // this.scaleCanvas();
        // this.renderDies();
        // this.renderText();
        // this.wafermap.canvasContext.restore();
        this.renderHover();
    }

    public renderHover(): void {
        this.wafermap.hoverWidth = this.wafermap.dataManager!.dieDimensions.width
        * this.wafermap.transform.k;
        this.wafermap.hoverHeight = this.wafermap.dataManager!.dieDimensions.height
        * this.wafermap.transform.k;
        this.wafermap.hoverOpacity = this.wafermap.hoverDie === undefined
            ? HoverDieOpacity.hide
            : HoverDieOpacity.show;
        this.wafermap.hoverTransform = this.calculateHoverTransform();
    }

    private calculateHoverTransform(): string {
        if (this.wafermap.hoverDie !== undefined) {
            const scaledX = this.wafermap.dataManager!.horizontalScale(
                this.wafermap.hoverDie.x
            )!;
            const scaledY = this.wafermap.dataManager!.verticalScale(
                this.wafermap.hoverDie.y
            )!;
            const transformedPoint = this.wafermap.transform.apply([
                scaledX + this.wafermap.dataManager!.margin.left,
                scaledY + this.wafermap.dataManager!.margin.top
            ]);
            return `translate(${transformedPoint[0]}, ${transformedPoint[1]})`;
        }
        return '';
    }

    private renderDies(): void {}

    private renderText(): void {}

    private clearCanvas(): void {}

    private scaleCanvas(): void {}
}
