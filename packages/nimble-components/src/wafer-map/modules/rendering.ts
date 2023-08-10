import type { WaferMap } from '..';
import { DieRenderInfo, HoverDieOpacity } from '../types';

/**
 * Responsible for drawing the dies inside the wafer map, adding dieText and scaling the canvas
 */
export class RenderingModule {
    private dies!: DieRenderInfo[];
    private readonly minDieDim = 50;

    public constructor(private readonly wafermap: WaferMap) {}

    public updateSortedDies(): void {
        this.dies = this.wafermap.dataManager.diesRenderInfo.sort((a, b) => {
            if (a.fillStyle > b.fillStyle) {
                return 1;
            }
            if (b.fillStyle > a.fillStyle) {
                return -1;
            }

            return 0;
        });
        this.updateDrawnWafer();
    }

    public updateDrawnWafer(): void {
        this.wafermap.canvasContext.save();
        this.clearCanvas();
        this.scaleCanvas();
        this.renderDies();
        if (!this.wafermap.dieLabelsHidden) {
            this.renderText();
        }
        this.wafermap.canvasContext.restore();
        this.renderHover();
    }

    public renderHover(): void {
        this.wafermap.hoverWidth = this.wafermap.dataManager.dieDimensions.width
            * this.wafermap.transform.k;
        this.wafermap.hoverHeight = this.wafermap.dataManager.dieDimensions.height
            * this.wafermap.transform.k;
        this.wafermap.hoverOpacity = this.wafermap.hoverDie === undefined
            ? HoverDieOpacity.hide
            : HoverDieOpacity.show;
        this.wafermap.hoverTransform = this.calculateHoverTransform();
    }

    private calculateHoverTransform(): string {
        if (this.wafermap.hoverDie !== undefined) {
            const scaledX = this.wafermap.dataManager.horizontalScale(
                this.wafermap.hoverDie.x
            )!;
            const scaledY = this.wafermap.dataManager.verticalScale(
                this.wafermap.hoverDie.y
            )!;
            const transformedPoint = this.wafermap.transform.apply([
                scaledX + this.wafermap.dataManager.margin.left,
                scaledY + this.wafermap.dataManager.margin.top
            ]);
            return `translate(${transformedPoint[0]}, ${transformedPoint[1]})`;
        }
        return '';
    }

    private renderDies(): void {
        let fillStyle = '';
        const context = this.wafermap.canvasContext;
        const transformMatrix = context.getTransform().invertSelf();
        let { x: trCanvasMinPointX, y: trCanvasMinPointY } = transformMatrix.transformPoint({ x: 0, y: 0 });
        const { x: trCanvasMaxPointX, y: trCanvasMaxPointY } = transformMatrix.transformPoint({
            x: this.wafermap.canvas.width,
            y: this.wafermap.canvas.height
        });
        const dieWidth = this.wafermap.dataManager.dieDimensions.width;
        const dieHeight = this.wafermap.dataManager.dieDimensions.height;
        trCanvasMinPointX -= dieWidth;
        trCanvasMinPointY -= dieHeight;

        for (const die of this.dies) {
            if (
                die.x >= trCanvasMinPointX && die.x < trCanvasMaxPointX
                && die.y >= trCanvasMinPointY && die.y < trCanvasMaxPointY
            ) {
                if (fillStyle !== die.fillStyle) {
                    context.fillStyle = die.fillStyle;
                    fillStyle = die.fillStyle;
                }
                context.fillRect(die.x, die.y, dieWidth, dieHeight);
            }
        }
    }

    private renderText(): void {
        const dieWidth = this.wafermap.dataManager.dieDimensions.width;
        const dieHeight = this.wafermap.dataManager.dieDimensions.height;
        const dieSize = dieWidth
            * dieHeight
            * (this.wafermap.transform.k || 1);
        if (dieSize >= this.minDieDim) {
            const fontsize = this.wafermap.dataManager.labelsFontSize;
            const context = this.wafermap.canvasContext;
            context.font = `${fontsize.toString()}px sans-serif`;
            context.fillStyle = '#ffffff';
            context.textAlign = 'center';
            context.lineCap = 'butt';
            const approxTextHeight = context.measureText('M');

            const transformMatrix = context.getTransform().invertSelf();
            let { x: trCanvasMinPointX, y: trCanvasMinPointY } = transformMatrix.transformPoint({ x: 0, y: 0 });
            const { x: trCanvasMaxPointX, y: trCanvasMaxPointY } = transformMatrix.transformPoint({
                x: this.wafermap.canvas.width,
                y: this.wafermap.canvas.height
            });
            trCanvasMinPointX -= dieWidth;
            trCanvasMinPointY -= dieHeight;

            for (const die of this.dies) {
                if (
                    die.x >= trCanvasMinPointX && die.x < trCanvasMaxPointX
                    && die.y >= trCanvasMinPointY && die.y < trCanvasMaxPointY
                ) {
                    context.fillText(
                        die.text,
                        die.x + dieWidth / 2,
                        die.y
                        + dieHeight / 2
                        + approxTextHeight.width / 2,
                        dieWidth - (dieWidth / 100) * 20
                    );
                }
            }
        }
    }

    private clearCanvas(): void {
        this.wafermap.canvasContext.clearRect(
            0,
            0,
            this.wafermap.canvas.width,
            this.wafermap.canvas.height
        );
    }

    private scaleCanvas(): void {
        this.wafermap.canvasContext.translate(
            this.wafermap.transform.x,
            this.wafermap.transform.y
        );
        this.wafermap.canvasContext.scale(
            this.wafermap.transform.k,
            this.wafermap.transform.k
        );
    }
}
