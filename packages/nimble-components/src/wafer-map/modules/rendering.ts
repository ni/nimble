import type { DieRenderInfo, Dimensions } from '../types';
import type { DataManager } from './data-manager';
/**
 * Responsible for drawing the dies inside the wafer map
 */
export class RenderingModule {
    private readonly waferData: DataManager;
    private context: CanvasRenderingContext2D;
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

    public drawWafer(transform?: number): void {
        this.clearCanvas();
        const dies: DieRenderInfo[] = this.waferData.diesRenderInfo;
        const dimensions: Dimensions = this.waferData.dieDimensions;
        this.dieSize = dimensions.width * dimensions.height * (transform || 1);
        dies.sort((a, b) => a.fillStyle.localeCompare(b.fillStyle));
        // let prev!: DieRenderInfo;

        for (const die of dies) {
            // if (!prev) {
            //     this.context.fillStyle = die.fillStyle;
            // }
            // if (prev && die.fillStyle !== prev.fillStyle && die.fillStyle) {
            //     this.context.fillStyle = die.fillStyle;
            // }
            this.context.fillStyle = die.fillStyle;
            this.context?.beginPath();
            this.context?.rect(die.x, die.y, dimensions.width, dimensions.height);
            this.context?.fill();
            // this.context?.fillRect(
            //     die.x,
            //     die.y,
            //     dimensions.width,
            //     dimensions.height
            // );

            if (this.dieSize >= 50) {
                const fontsize = this.waferData.labelsFontSize;
                this.context.font = `${fontsize.toString()}px sans-serif`;
                this.context.fillStyle = '#ffffff';
                this.context.textAlign = 'center';
                this.context.lineCap = 'butt';
                const aproxTextHeight = this.context.measureText('M');

                this.context.fillText(
                    die.text,
                    die.x + dimensions.width / 2,
                    die.y + dimensions.height / 2 + aproxTextHeight.width / 2,
                    dimensions.width - (dimensions.width / 100) * 20
                );
            }
            // prev = die;
        }
    }

    // public drawWaferss(): void {
    //     const dies: DieRenderInfo[] = this.waferData.diesRenderInfo;
    //     const dimensions: Dimensions = this.waferData.dieDimensions;
    //     const off: OffscreenCanvas = this.canvas.transferControlToOffscreen();
    //     let offScreenCanvas = document.createElement('canvas');
    //     offScreenCanvas.width = this.width;
    //     offScreenCanvas.height = this.heigth;
    //     const context = offScreenCanvas.getContext('2d')!;

    //     // eslint-disable-next-line @typescript-eslint/prefer-for-of
    //     for (let i = 0; i < dies.length; i++) {
    //         context.fillStyle = dies[i]!.fillStyle;
    //         context?.fillRect(
    //             dies[i]!.x,
    //             dies[i]!.y,
    //             dimensions.width,
    //             dimensions.height
    //         );
    //     }
    //     for (const die of dies) {
    //         context.fillStyle = die.fillStyle;
    //         context?.fillRect(
    //             die.x,
    //             die.y,
    //             dimensions.width,
    //             dimensions.height
    //         );
    //     }

    // }

    public clearCanvas(): void {
        this.context.clearRect(
            0,
            0,
            this.waferData.containerDimensions.width,
            this.waferData.containerDimensions.height
        );
    }
}
