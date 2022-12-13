import type { DieRenderInfo, Dimensions } from '../types';
import type { DataManager } from './data-manager';

/**
 * Responsible for drawing the dies inside the wafer map
 */
export class RenderingModule {
    private readonly waferData: DataManager;
    private readonly context: CanvasRenderingContext2D;

    public constructor(waferData: DataManager, canvas: HTMLCanvasElement) {
        this.waferData = waferData;
        this.context = canvas.getContext('2d')!;
    }

    public drawWafer(): void {
        const dies: DieRenderInfo[] = this.waferData.diesRenderInfo;
        const dimensions: Dimensions = this.waferData.dieDimensions;

        for (const die of dies) {
            this.context.fillStyle = die.fillStyle;
            this.context?.fillRect(
                die.x,
                die.y,
                dimensions.width,
                dimensions.height
            );

            this.context.font = this.waferData.labelsFontSize.toString();
            this.context.fillStyle = '#ffffff';
            this.context.textAlign = 'center';
            const aproxTextHeight = this.context.measureText('M');

            this.context.fillText(
                die.text,
                die.x + dimensions.width / 2,
                die.y + dimensions.height / 2 + aproxTextHeight.width / 2
            );
        }
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
