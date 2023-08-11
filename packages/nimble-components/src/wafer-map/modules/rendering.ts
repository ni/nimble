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
        this.drawWafer();
    }

    public drawWafer(): void {
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
        const dieWidth = this.wafermap.dataManager.dieDimensions.width;
        const dieHeight = this.wafermap.dataManager.dieDimensions.height;
        const transformedCanvasMinPoint = this.wafermap.transform.invert([
            0, 0
        ]);
        const transformedCanvasMaxPoint = this.wafermap.transform.invert([
            this.wafermap.canvas.width,
            this.wafermap.canvas.height
        ]);
        transformedCanvasMinPoint[0] -= dieWidth;
        transformedCanvasMinPoint[1] -= dieHeight;

        for (const die of this.dies) {
            if (
                this.isDieVisible(
                    die,
                    transformedCanvasMinPoint,
                    transformedCanvasMaxPoint
                )
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
        const dieSize = dieWidth * dieHeight * (this.wafermap.transform.k || 1);
        if (dieSize >= this.minDieDim) {
            const fontsize = this.wafermap.dataManager.labelsFontSize;
            const context = this.wafermap.canvasContext;
            context.font = `${fontsize.toString()}px sans-serif`;
            context.fillStyle = '#ffffff';
            context.textAlign = 'center';
            context.lineCap = 'butt';
            const approxTextHeight = context.measureText('M');

            const transformedCanvasMinPoint = this.wafermap.transform.invert([
                0, 0
            ]);
            const transformedCanvasMaxPoint = this.wafermap.transform.invert([
                this.wafermap.canvas.width,
                this.wafermap.canvas.height
            ]);
            transformedCanvasMinPoint[0] -= dieWidth;
            transformedCanvasMinPoint[1] -= dieHeight;

            for (const die of this.dies) {
                if (
                    this.isDieVisible(
                        die,
                        transformedCanvasMinPoint,
                        transformedCanvasMaxPoint
                    )
                ) {
                    context.fillText(
                        die.text,
                        die.x + dieWidth / 2,
                        die.y + dieHeight / 2 + approxTextHeight.width / 2,
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

    private isDieVisible(
        die: DieRenderInfo,
        minPoint: [number, number],
        maxPoint: [number, number]
    ): boolean {
        return (
            die.x >= minPoint[0]
            && die.x < maxPoint[0]
            && die.y >= minPoint[1]
            && die.y < maxPoint[1]
        );
    }
}
