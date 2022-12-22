import { select } from 'd3-selection';
import {
    zoom,
    ZoomBehavior,
    zoomIdentity,
    ZoomTransform,
    zoomTransform
} from 'd3-zoom';
import { DieRenderInfo, WaferMapQuadrant } from '../types';
import type { DataManager } from './data-manager';
import type { RenderingModule } from './rendering';

/**
 * ZoomHandler deals with user interactions and events like zooming
 */
export class ZoomHandler {
    public transform: ZoomTransform | undefined;
    public zoomTransform: ZoomTransform = zoomIdentity;

    private readonly minScale = 1.1;
    private readonly minExtentPoint: [number, number] = [-100, -100];
    private readonly extentPadding = 100;
    private lastNodeData = '';

    public constructor(
        private readonly canvas: HTMLCanvasElement,
        private readonly rect: HTMLCanvasElement,
        private readonly zoomContainer: HTMLElement,
        private readonly dataManager: DataManager,
        private readonly quadrant: WaferMapQuadrant,
        private readonly renderingModule: RenderingModule
    ) {}

    public attachZoomBehavior(): void {
        const zoomBehavior = this.createZoomBehavior();
        zoomBehavior(select(this.canvas as Element));
    }

    public toggleHoverDie(show: boolean, x = 0, y = 0): void {
        if (show) {
            this.rect.setAttribute('transform', `translate(${x},${y})`);
            this.rect.setAttribute('opacity', '0.7');
        } else {
            this.rect.setAttribute('opacity', '0');
            this.lastNodeData = '';
        }
    }

    public createHoverDie(): void {
        this.rect.setAttribute('x', '0');
        this.rect.setAttribute('y', '0');
        this.rect.setAttribute('fill', 'black');
        this.rect.setAttribute('opacity', '0');
        this.rect.setAttribute('pointer-events', 'none');

        let zoomTransformK = 0;
        if (this.zoomTransform) {
            zoomTransformK = this.zoomTransform.k;
        }

        if (this.dataManager) {
            this.rect.setAttribute('width', (this.dataManager.dieDimensions.width * zoomTransformK).toString());
            this.rect.setAttribute('height', (this.dataManager.dieDimensions.height * zoomTransformK).toString());
        }
    }

    public mousemove(event: MouseEvent): void {
        // Get mouse position
        const mouseX = event.offsetX;
        const mouseY = event.offsetY;

        // get color for current mouse position to verify that mouse is hovering over a die.
        const canvasContext = this.canvas.getContext('2d');
        if (canvasContext === null) {
            return;
        }
        const col = canvasContext.getImageData(mouseX, mouseY, 1, 1).data;
        // if sum of rgb==0 then not hovering on die
        let rgbSum = 0;
        if (col[0]) {
            rgbSum += col[0];
        }
        if (col[1]) {
            rgbSum += col[1];
        }
        if (col[2]) {
            rgbSum += col[2];
        }

        if (rgbSum <= 0) {
            return;
        }

        // get original mouse position in case we are in zoom.
        const invertedPoint = this.zoomTransform.invert([mouseX, mouseY]);
        const { x, y } = this.calculateDiePositionNumbers(invertedPoint[0], invertedPoint[1]);

        // find die by x and y.
        const nodeData = this.dataManager.diesRenderInfo.find(die => this.compareDiePosition(die, x, y));
        const nodeDataSerialized = JSON.stringify(nodeData);
        if (this.lastNodeData === nodeDataSerialized) {
            return;
        }
        this.lastNodeData = nodeDataSerialized;
        if (nodeData) {
            const transformedPoint = this.zoomTransform.apply([this.dataManager.horizontalScale(x) + this.dataManager.margin.left, this.dataManager.verticalScale(y) + this.dataManager.margin.top]);
            this.toggleHoverDie(true, transformedPoint[0], transformedPoint[1]);
        } else {
            this.toggleHoverDie(false);
        }
    }

    private compareDiePosition(die: DieRenderInfo, x: number, y: number): boolean {
        const diePositionNumbers = this.calculateDiePositionNumbers(die.x, die.y);
        return diePositionNumbers.x === x && diePositionNumbers.y === y;
    }

    private calculateDiePositionNumbers(mouseX: number, mouseY: number): { x: number, y: number } {
        const axisLocation = this.quadrant;
        const xRoundfunction = (axisLocation === WaferMapQuadrant.bottomLeft || axisLocation === WaferMapQuadrant.topLeft) ? Math.floor : Math.ceil;
        const yRoundfunction = (axisLocation === WaferMapQuadrant.topLeft || axisLocation === WaferMapQuadrant.topRight) ? Math.floor : Math.ceil;
        // go to x and y scale to get the x,y values of the die.
        const x = xRoundfunction(this.dataManager.horizontalScale.invert(mouseX - this.dataManager.margin.left));
        const y = yRoundfunction(this.dataManager.verticalScale.invert(mouseY - this.dataManager.margin.top));
        return { x, y };
    }

    private createZoomBehavior(): ZoomBehavior<Element, unknown> {
        this.canvas.addEventListener('wheel', event => event.preventDefault());
        if (this.dataManager === undefined) return zoom();
        const zoomBehavior = zoom()
            .scaleExtent([
                1.1,
                this.getZoomMax(
                    this.canvas.width * this.canvas.height,
                    this.dataManager.containerDimensions.width
                    * this.dataManager.containerDimensions.height
                )
            ])
            .translateExtent([
                this.minExtentPoint,
                [
                    this.canvas.width + this.extentPadding,
                    this.canvas.height + this.extentPadding
                ]
            ])
            .filter((event: Event) => {
                this.transform = zoomTransform(this.canvas);
                return this.transform.k >= this.minScale || event.type === 'wheel';
            })
            .on('zoom', (event: { transform: ZoomTransform }) => {
                this.toggleHoverDie(false);
                if (this.dataManager === undefined) return;
                this.transform = event.transform;
                const canvasContext = this.canvas.getContext('2d');
                if (canvasContext === null) return;
                canvasContext.save();
                if (this.transform.k === this.minScale) {
                    this.zoomTransform = zoomIdentity;
                    this.clearCanvas(
                        canvasContext,
                        this.canvas.width,
                        this.canvas.height
                    );
                    this.scaleCanvas(
                        canvasContext,
                        zoomIdentity.x,
                        zoomIdentity.y,
                        zoomIdentity.k
                    );
                    this.createHoverDie();
                    this.renderingModule.drawWafer();
                    zoomBehavior.transform(
                        select(this.canvas as Element),
                        zoomIdentity
                    );
                } else {
                    this.zoomTransform = this.transform;
                    this.clearCanvas(
                        canvasContext,
                        this.canvas.width * this.zoomTransform.k,
                        this.canvas.height * this.zoomTransform.k
                    );
                    this.scaleCanvas(
                        canvasContext,
                        this.transform.x,
                        this.transform.y,
                        this.transform.k
                    );
                    this.createHoverDie();
                    this.renderingModule.drawWafer();
                }
                canvasContext.restore();
                this.zoomContainer.setAttribute(
                    'transform',
                    this.zoomTransform.toString()
                );
            });

        return zoomBehavior;
    }

    private getZoomMax(canvasArea: number, dataArea: number): number {
        return Math.ceil((dataArea / canvasArea) * 100);
    }

    private clearCanvas(
        context: CanvasRenderingContext2D,
        width: number,
        height: number
    ): void {
        context.clearRect(0, 0, width, height);
    }

    private scaleCanvas(
        context: CanvasRenderingContext2D,
        x = 0,
        y = 0,
        scale = 1
    ): void {
        context.translate(x, y);
        context.scale(scale, scale);
    }
}
