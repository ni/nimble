import type { WaferMap } from '..';
// import { DieRenderInfo, Dimensions, HoverDieOpacity } from '../types';

/**
 * Responsible for drawing the dies inside the wafer map, adding dieText and scaling the canvas
 */
export class RenderingModule {
    public constructor(private readonly wafermap: WaferMap) {
    }

    public drawWafer(): void {
        this.wafermap.canvasContext.save();
        this.clearCanvas();
        this.scaleCanvas();
        this.renderDies();
        this.renderText();
        this.wafermap.canvasContext.restore();
        this.renderHover();
    }

    public renderHover(): void {}

    private calculateHoverTransform(): string {
        return '';
    }

    private renderDies(): void {}

    private renderText(): void {}

    private clearCanvas(): void {}

    private scaleCanvas(): void {}
}
