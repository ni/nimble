import type { WaferMap } from '..';
import { DieRenderInfo, HoverDieOpacity } from '../types';

/**
 * Responsible for drawing the dies inside the wafer map, adding dieText and scaling the canvas
 */
export class RenderingModule {
    private dies!: DieRenderInfo[];

    public constructor(wafermap: Readonly<WaferMap>) {
        this.sortDies(wafermap);
    //     this.dies = wafermap.dataManager!.diesRenderInfo;
    //     this.dimensions = wafermap.dataManager!.dieDimensions;
    //     this.labelFontSize = wafermap.dataManager!.labelsFontSize;
    }

    public drawWafer(wafermap: Readonly<WaferMap>): void {
        wafermap.canvasContext.save();
        this.clearCanvas(wafermap);
        this.scaleCanvas(wafermap);
        this.sortDies(wafermap);
        this.renderDies(wafermap);
        this.renderText(wafermap);
        wafermap.canvasContext.restore();
        this.renderHover(wafermap);
    }

    public renderHover(wafermap: Readonly<WaferMap>): void {
        wafermap.setHoverData(
            wafermap.dataManager!.dieDimensions.width * wafermap.transform.k,
            wafermap.dataManager!.dieDimensions.height * wafermap.transform.k,
            wafermap.hoverDie === undefined ? HoverDieOpacity.hide
                : HoverDieOpacity.show,
            this.calculateHoverTransform(wafermap)
        );
    }

    private calculateHoverTransform(wafermap: Readonly<WaferMap>): string {
        if (wafermap.hoverDie !== undefined) {
            const scaledX = wafermap.dataManager!.horizontalScale(
                wafermap.hoverDie.x
            )!;
            const scaledY = wafermap.dataManager!.verticalScale(
                wafermap.hoverDie.y
            )!;
            const transformedPoint = wafermap.transform.apply([
                scaledX + wafermap.dataManager!.margin.left,
                scaledY + wafermap.dataManager!.margin.top
            ]);
            return `translate(${transformedPoint[0]}, ${transformedPoint[1]})`;
        }
        return '';
    }

    private sortDies(wafermap: Readonly<WaferMap>): void {
        this.dies = wafermap.dataManager!.diesRenderInfo.sort((a, b) => {
            if (a.fillStyle > b.fillStyle) {
                return 1;
            }
            if (b.fillStyle > a.fillStyle) {
                return -1;
            }

            return 0;
        });
    }

    private renderDies(wafermap: Readonly<WaferMap>): void {
        let prev: DieRenderInfo | undefined;

        for (const die of this.dies) {
            if (!prev) {
                wafermap.canvasContext.fillStyle = die.fillStyle;
            }
            if (prev && die.fillStyle !== prev.fillStyle && die.fillStyle) {
                wafermap.canvasContext.fillStyle = die.fillStyle;
            }
            wafermap.canvasContext.fillRect(
                die.x,
                die.y,
                wafermap.dataManager!.dieDimensions.width,
                wafermap.dataManager!.dieDimensions.height
            );
            prev = die;
        }
    }

    private renderText(wafermap: Readonly<WaferMap>): void {
        const dieSize = wafermap.dataManager!.dieDimensions.width
            * wafermap.dataManager!.dieDimensions.height
            * (wafermap.transform.k || 1);
        const fontsize = wafermap.dataManager!.labelsFontSize;
        wafermap.canvasContext.font = `${fontsize.toString()}px sans-serif`;
        wafermap.canvasContext.fillStyle = '#ffffff';
        wafermap.canvasContext.textAlign = 'center';
        wafermap.canvasContext.lineCap = 'butt';
        const approxTextHeight = wafermap.canvasContext.measureText('M');

        const dieDimensions = wafermap.dataManager!.dieDimensions;
        if (dieSize >= 50) {
            for (const die of this.dies) {
                wafermap.canvasContext.fillText(
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

    private clearCanvas(wafermap: Readonly<WaferMap>): void {
        wafermap.canvasContext.clearRect(
            0,
            0,
            wafermap.canvasWidth * wafermap.transform.k,
            wafermap.canvasHeight * wafermap.transform.k
        );
    }

    private scaleCanvas(wafermap: Readonly<WaferMap>): void {
        wafermap.canvasContext.translate(
            wafermap.transform.x,
            wafermap.transform.y
        );
        wafermap.canvasContext.scale(
            wafermap.transform.k,
            wafermap.transform.k
        );
    }
}
