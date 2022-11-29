import type { Dimensions, RenderDie } from '../types';
import type { DataManager } from './data-manager';

// eslint-disable-next-line jsdoc/require-description
/**
 *
 */
export class RenderingModule {
    public static drawWafer(waferData: DataManager, canvas: HTMLCanvasElement): void {
        const context = canvas.getContext('2d');
        const dies: RenderDie[] = waferData.renderDies;
        const dimensions: Dimensions = waferData.dieDimensions;

        for (const die of dies) {
            debugger;
            context!.fillStyle = die.fillStyle;
            context?.fillRect(die.x, die.y, dimensions.width, dimensions.height);

            context!.font = waferData.labelsFontSize.toString();
            context!.fillStyle = '#ffffff';
            context!.textAlign = 'center';
            const aproxTextHeight = (context!.measureText('M'));

            context!.fillText('0%', die.x + (dimensions.width / 2), die.y + (dimensions.height / 2) + (aproxTextHeight.width / 2));
        }
    }

    public static createTransform(waferData: DataManager, zoomContianer: HTMLElement): void {
        zoomContianer.appendChild(document.createElement('g'));
        const g = zoomContianer.getElementsByTagName('g');
        g[0]?.setAttribute('transform', `translate(${waferData.margin.left},${waferData.margin.top})`);
        g[0]?.setAttribute('width', waferData.containerDimensions.width.toString());
        g[0]?.setAttribute('heigth', waferData.containerDimensions.height.toString());
    }
}