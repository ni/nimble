import type { DieRenderInfo, Dimensions } from '../types';
import type { DataManager } from './data-manager';

/**
 * Responsible for drawing the dies inside the wafer map
 */
export class RenderingModule {
    private readonly waferData: DataManager;
    private readonly context: CanvasRenderingContext2D;
    private dieSize: number | undefined;

    public constructor(waferData: DataManager, canvas: HTMLCanvasElement) {
        this.waferData = waferData;
        this.context = canvas.getContext('2d')!;
    }

    public drawWafer(transform?: number): void {
        this.renderDies(transform);
        this.renderText(transform);
    }

    public clearCanvas(width: number, height: number): void {
        this.context.clearRect(0, 0, width, height);
    }

    private renderDies(transform?: number): void {
        const dies: DieRenderInfo[] = this.waferData.diesRenderInfo;
        const dimensions: Dimensions = this.waferData.dieDimensions;
        this.dieSize = dimensions.width * dimensions.height * (transform || 1);
        dies.sort((a, b) => a.fillStyle.localeCompare(b.fillStyle));
        let prev!: DieRenderInfo;

        for (const die of dies) {
            if (!prev) {
                this.context.fillStyle = die.fillStyle;
            }
            if (prev && die.fillStyle !== prev.fillStyle && die.fillStyle) {
                this.context.fillStyle = die.fillStyle;
            }
            this.context?.beginPath();
            this.context?.rect(die.x, die.y, dimensions.width, dimensions.height);
            this.context?.fill();
            prev = die;
        }
    }

    private renderText(transform?: number): void {
        debugger;
        const dies: DieRenderInfo[] = this.waferData.diesRenderInfo;
        const dimensions: Dimensions = this.waferData.dieDimensions;
        this.dieSize = dimensions.width * dimensions.height * (transform || 1);
        this.context.font = this.waferData.labelsFontSize.toString();
        this.context.fillStyle = '#ffffff';
        this.context.textAlign = 'center';
        const aproxTextHeight = this.context.measureText('M');

        // if (this.dieSize >= 50) {
        for (const die of dies) {
            this.context.fillText(
                die.text,
                die.x + dimensions.width / 2,
                die.y + dimensions.height / 2 + aproxTextHeight.width / 2
            );
        }
        // }
    }
}
