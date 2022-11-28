import type { Dimensions, RenderDie } from '../types';
import type { Data } from './data.module';

// eslint-disable-next-line jsdoc/require-description
/**
 *
 */
export class RenderingModule {
    public static drawWafer(waferData: Data, canvas: HTMLCanvasElement): void {
        const context = canvas.getContext('2d');
        const dies: RenderDie[] = waferData.renderDies;
        const dimensions: Dimensions = waferData.dieDimensions;
        const labelsFontSize = Math.min(dimensions.height, dimensions.width / (3 * 0.5) * 0.8);

        for (const die of dies) {
            context!.fillStyle = die.fillStyle;
            context?.fillRect(die.x, die.y, dimensions.width, dimensions.height);

            context!.font = `${labelsFontSize}px sans-serif`;
            context!.fillStyle = '#ffffff';
            context!.textAlign = 'center';
            const aproxTextHeight = (context!.measureText('M'));

            context!.fillText('0%', die.x + (dimensions.width / 2), die.y + (dimensions.height / 2) + (aproxTextHeight.width / 2));
        }
    }
}