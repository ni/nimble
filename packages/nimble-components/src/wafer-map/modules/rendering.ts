import type { WaferMap } from '..';
import { DieRenderInfo, HoverDieOpacity } from '../types';

/**
 * Responsible for drawing the dies inside the wafer map, adding dieText and scaling the canvas
 */
export class RenderingModule {
    private dies!: DieRenderInfo[];
    private readonly minDieDim = 50;

    public constructor(private readonly wafermap: WaferMap) {
        this.sortDies();
    //     this.dies = this.wafermap.dataManager!.diesRenderInfo;
    //     this.dimensions = this.wafermap.dataManager!.dieDimensions;
    //     this.labelFontSize = this.wafermap.dataManager!.labelsFontSize;
    }

    public drawWafer(): void {
        this.wafermap.canvasContext.save();
        this.clearCanvas();
        this.scaleCanvas();
        this.sortDies();
        this.renderDies();
        this.renderText();
        this.wafermap.canvasContext.restore();
        this.renderHover();
    }

    public renderHover(): void {
        this.wafermap.setHoverData(
            this.wafermap.dataManager!.dieDimensions.width * this.wafermap.transform.k,
            this.wafermap.dataManager!.dieDimensions.height * this.wafermap.transform.k,
            this.wafermap.hoverDie === undefined ? HoverDieOpacity.hide
                : HoverDieOpacity.show,
            this.calculateHoverTransform()
        );
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

    private sortDies(): void {
        this.dies = this.wafermap.dataManager!.diesRenderInfo.sort((a, b) => {
            if (a.fillStyle > b.fillStyle) {
                return 1;
            }
            if (b.fillStyle > a.fillStyle) {
                return -1;
            }

            return 0;
        });
    }

    private renderDies(): void {
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
                this.wafermap.dataManager!.dieDimensions.width,
                this.wafermap.dataManager!.dieDimensions.height
            );
            prev = die;
        }
    }

    private renderText(): void {
        const dieSize = this.wafermap.dataManager!.dieDimensions.width
            * this.wafermap.dataManager!.dieDimensions.height
            * (this.wafermap.transform.k || 1);
        const fontsize = this.wafermap.dataManager!.labelsFontSize;
        this.wafermap.canvasContext.font = `${fontsize.toString()}px sans-serif`;
        this.wafermap.canvasContext.fillStyle = '#ffffff';
        this.wafermap.canvasContext.textAlign = 'center';
        this.wafermap.canvasContext.lineCap = 'butt';
        const approxTextHeight = this.wafermap.canvasContext.measureText('M');

        const dieDimensions = this.wafermap.dataManager!.dieDimensions;
        if (dieSize >= this.minDieDim) {
            for (const die of this.dies) {
                this.wafermap.canvasContext.fillText(
                    die.text,
                    die.x + dieDimensions.width / 2,
                    die.y
                        + dieDimensions.height / 2
                        + approxTextHeight.width / 2,
                    dieDimensions.width - (dieDimensions.width / 100) * 20
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
