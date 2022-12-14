import { select } from 'd3-selection';
import { zoom, ZoomBehavior, zoomIdentity, ZoomTransform, zoomTransform } from 'd3-zoom';
import type { DataManager } from './data-manager';
import type { RenderingModule } from './rendering';

/**
 * InteractionHandler deals with user interactions and events like zooming
 */
export class ZoomHandler {
    private static zoomTransform: ZoomTransform = zoomIdentity;

    public static createZoomBehavior(canvas: HTMLCanvasElement, zoomContainer: HTMLElement, dataManager: DataManager, renderingModule: RenderingModule): ZoomBehavior<Element, unknown> {
        canvas.addEventListener('wheel', event => event.preventDefault());
        if (dataManager === undefined) return zoom();
        const zoomBehavior = zoom()
            .scaleExtent([1.1, this.getZoomMax(canvas.width * canvas.height, dataManager.containerDimensions.width * dataManager.containerDimensions.height)])
            .translateExtent([[-100, -100], [canvas.width + 100, canvas.height + 100]])
            .filter((event: Event) => {
                const transform = zoomTransform(canvas);
                return transform.k >= 1.1 || event.type === 'wheel';
            })
            .on('zoom', (event: { transform: ZoomTransform }) => {
                if (dataManager === undefined) return;
                const transform = event.transform;
                const canvasContext = canvas.getContext('2d');
                if (canvasContext === null) return;
                canvasContext.save();
                if (transform.k === 1.1) {
                    this.zoomTransform = zoomIdentity;
                    this.clearCanvas(canvasContext, canvas.width, canvas.height);
                    this.scaleCanvas(canvasContext, zoomIdentity.x, zoomIdentity.y, zoomIdentity.k);
                    renderingModule.drawWafer();
                    zoomBehavior.transform(select(canvas as Element), zoomIdentity);
                } else {
                    this.zoomTransform = transform;
                    this.clearCanvas(canvasContext, canvas.width * this.zoomTransform.k, canvas.height * this.zoomTransform.k);
                    this.scaleCanvas(canvasContext, transform.x, transform.y, transform.k);
                    renderingModule.drawWafer();
                }
                canvasContext.restore();
                zoomContainer.setAttribute('transform', this.zoomTransform.toString());
            });

        return zoomBehavior;
    }

    private static getZoomMax(canvasArea: number, dataArea: number): number {
        return Math.ceil((dataArea / canvasArea) * 100);
    }

    private static clearCanvas(context: CanvasRenderingContext2D, width: number, height: number): void {
        context.clearRect(0, 0, width, height);
    }

    private static scaleCanvas(context: CanvasRenderingContext2D, x = 0, y = 0, scale = 1): void {
        context.translate(x, y);
        context.scale(scale, scale);
    }
}