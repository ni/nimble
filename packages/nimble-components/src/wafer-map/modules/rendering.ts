import type { DieRenderInfo, Dimensions } from '../types';
import type { DataManager } from './data-manager';

/**
 * Responsible for drawing the dies inside the wafer map
 */
export class RenderingModule {
    private readonly waferData: DataManager;
    private readonly canvas: HTMLCanvasElement;

    public constructor(waferData: DataManager, canvas: HTMLCanvasElement) {
        this.waferData = waferData;
        this.canvas = canvas;
    }

    public drawWafer(): void {
        const context = this.canvas.getContext('2d')!;
        const dies: DieRenderInfo[] = this.waferData.diesRenderInfo;
        const dimensions: Dimensions = this.waferData.dieDimensions;

        for (const die of dies) {
            context.fillStyle = die.fillStyle;
            context?.fillRect(
                die.x,
                die.y,
                dimensions.width,
                dimensions.height
            );

            context.font = this.waferData.labelsFontSize.toString();
            context.fillStyle = '#ffffff';
            context.textAlign = 'center';
            const aproxTextHeight = context.measureText('M');

            context.fillText(
                die.text,
                die.x + dimensions.width / 2,
                die.y + dimensions.height / 2 + aproxTextHeight.width / 2
            );
        }
    }

    public clearCanvas(): void {
        const context = this.canvas.getContext('2d')!;
        context.clearRect(
            0,
            0,
            this.waferData.containerDimensions.width,
            this.waferData.containerDimensions.height
        );
    }
}
