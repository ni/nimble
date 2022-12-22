import type { DieRenderInfo, Dimensions } from '../types';
import type { DataManager } from './data-manager';
/**
 * Responsible for drawing the dies inside the wafer map
 */
export class RenderingModule {
    private readonly waferData: DataManager;
    private readonly context: CanvasRenderingContext2D;
    private dieSize: number | undefined;
    private readonly width: number;
    private readonly heigth: number;
    private readonly canvas: HTMLCanvasElement;
    private readonly glcontext: RenderingContext;

    public constructor(waferData: DataManager, canvas: HTMLCanvasElement) {
        this.waferData = waferData;
        this.context = canvas.getContext('2d')!;
        this.glcontext = canvas.getContext('webgl-2d')!;
        this.width = canvas.width!;
        this.heigth = canvas.height!;
        this.canvas = canvas;
    }

    public drawWafer(): void {
        this.clearCanvas();
        const dies: DieRenderInfo[] = this.waferData.diesRenderInfo;
        const dimensions: Dimensions = this.waferData.dieDimensions;
        dies.sort((a, b) => a.fillStyle.localeCompare(b.fillStyle));
        let prev!: DieRenderInfo;
        for (const die of dies) {
            if (!prev) {
                this.context.fillStyle = die.fillStyle;
            }
            if (prev && die.fillStyle !== prev.fillStyle) {
                this.context.fillStyle = die.fillStyle;
            }
            this.context?.fillRect(
                die.x,
                die.y,
                dimensions.width,
                dimensions.height
            );
            prev = die;
            // const fontsize = this.waferData.labelsFontSize;
            // this.context.font = `${fontsize.toString()}px sans-serif`;
            // this.context.fillStyle = '#ffffff';
            // this.context.textAlign = 'center';
            // this.context.lineCap = 'butt';
            // const aproxTextHeight = this.context.measureText('M');

            // this.context.fillText(
            //     die.text,
            //     die.x + dimensions.width / 2,
            //     die.y + dimensions.height / 2 + aproxTextHeight.width / 2,
            //     dimensions.width - (dimensions.width / 100) * 20
            // );
        }
    }

    public drawWafers(): void {
        const dies: DieRenderInfo[] = this.waferData.diesRenderInfo;
        const dimensions: Dimensions = this.waferData.dieDimensions;
        const offScreenCanvas = document.createElement('canvas');
        offScreenCanvas.width = this.width;
        offScreenCanvas.height = this.heigth;
        const context = offScreenCanvas.getContext('2d')!;

        for (const die of dies) {
            context.fillStyle = die.fillStyle;
            context?.fillRect(
                die.x,
                die.y,
                dimensions.width,
                dimensions.height
            );
            this.context.drawImage(offScreenCanvas, 0, 0);
        }
        // this.context.drawImage(offScreenCanvas, 0, 0);
    }

    public reDrawWafer(transformK: number): void {
        this.dieSize = this.waferData.dieDimensions.width * this.waferData.dieDimensions.height * (transformK || 1);
        this.drawWafer();
    }

    public clearCanvas(): void {
        this.context.clearRect(
            0,
            0,
            this.waferData.containerDimensions.width,
            this.waferData.containerDimensions.height
        );
    }
}
