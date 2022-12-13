import type { DieRenderInfo, Dimensions } from '../types';
import type { DataManager } from './data-manager';

/**
 * Responsible for drawing the dies inside the wafer map
 */
export class RenderingModule {
    public drawWafer(waferData: DataManager, canvas: HTMLCanvasElement): void {
        const context = canvas.getContext('2d')!;
        const dies: DieRenderInfo[] = waferData.diesRenderInfo;
        const dimensions: Dimensions = waferData.dieDimensions;

        for (const die of dies) {
            context.fillStyle = die.fillStyle;
            context?.fillRect(die.x, die.y, dimensions.width, dimensions.height);

            context.font = waferData.labelsFontSize.toString();
            context.fillStyle = '#ffffff';
            context.textAlign = 'center';
            const aproxTextHeight = (context.measureText('M'));

            context.fillText(die.text, die.x + (dimensions.width / 2), die.y + (dimensions.height / 2) + (aproxTextHeight.width / 2));
        }
    }

    public clearCanvas(waferData: DataManager, canvas: HTMLCanvasElement): void {
        const context = canvas.getContext('2d')!;
        context.clearRect(0, 0, waferData.containerDimensions.width, waferData.containerDimensions.height);
    }
}