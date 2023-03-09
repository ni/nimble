import type { WaferMap } from '..';
import { DieRenderInfo, Dimensions, HoverDieOpacity, Margin } from '../types';

/**
 * Responsible for drawing the dies inside the wafer map, adding dieText and scaling the canvas
 */
export class RenderingModule {
    private readonly dies: DieRenderInfo[];
    private readonly dieDimensions: Dimensions;
    private readonly labelsFontSize: number;
    private readonly margin: Margin;

    public constructor(private readonly wafermap: WaferMap) {
        this.dies = wafermap.dataManager!.diesRenderInfo;
        this.dieDimensions = wafermap.dataManager!.dieDimensions;
        this.labelsFontSize = wafermap.dataManager!.labelsFontSize;
        this.margin = wafermap.dataManager!.margin;
    }

    public drawWafer(): void {
        this.wafermap.canvasContext.save();
        this.clearCanvas();
        this.scaleCanvas();
        this.renderDies();
        this.renderText();
        this.wafermap.canvasContext.restore();
    }

    public renderHover(): void {
        this.wafermap.hoverWidth = this.dieDimensions.width * this.wafermap.transform.k;
        this.wafermap.hoverHeight = this.dieDimensions.height * this.wafermap.transform.k;
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
                scaledX + this.margin.left,
                scaledY + this.margin.top
            ]);
            return `translate(${transformedPoint[0]}, ${transformedPoint[1]})`;
        }
        return '';
    }

    private renderDies(): void {
        this.dies.sort((a, b) => {
            if (a.fillStyle > b.fillStyle) {
                return 1;
            }
            if (b.fillStyle > a.fillStyle) {
                return -1;
            }

            return 0;
        });

        let prev: DieRenderInfo | undefined;

        for (const die of this.dies) {
            if (!prev) {
                this.wafermap.canvasContext.fillStyle = die.fillStyle;
            }
            if (prev && die.fillStyle !== prev.fillStyle && die.fillStyle) {
                this.wafermap.canvasContext.fillStyle = die.fillStyle;
            }
            this.wafermap.canvasContext.fillRect(
                die.x,
                die.y,
                this.dieDimensions.width,
                this.dieDimensions.height
            );
            prev = die;
        }
    }

    private renderText(): void {
        const dieSize = this.dieDimensions.width
            * this.dieDimensions.height
            * (this.wafermap.transform.k || 1);
        const fontsize = this.labelsFontSize;
        this.wafermap.canvasContext.font = `${fontsize.toString()}px sans-serif`;
        this.wafermap.canvasContext.fillStyle = '#ffffff';
        this.wafermap.canvasContext.textAlign = 'center';
        this.wafermap.canvasContext.lineCap = 'butt';
        const approxTextHeight = this.wafermap.canvasContext.measureText('M');

        if (dieSize >= 50) {
            for (const die of this.dies) {
                this.wafermap.canvasContext.fillText(
                    die.text,
                    die.x + this.dieDimensions.width / 2,
                    die.y
                        + this.dieDimensions.height / 2
                        + approxTextHeight.width / 2,
                    this.dieDimensions.width
                        - (this.dieDimensions.width / 100) * 20
                );
            }
        }
    }

    private clearCanvas(): void {
        this.wafermap.canvasContext.clearRect(
            0,
            0,
            this.wafermap.canvasWidth * this.wafermap.transform.k,
            this.wafermap.canvasHeight * this.wafermap.transform.k
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
