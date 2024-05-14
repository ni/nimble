import { type Remote, transfer } from 'comlink';
import type { ZoomTransform } from 'd3-zoom';
import type { WaferMap } from '..';
import { HoverDieOpacity } from '../types';
import { createMatrixRenderer } from '../modules/create-matrix-renderer';
import type { MatrixRenderer } from '../../../build/generate-workers/dist/esm/source/matrix-renderer';
import type { Dimensions, State } from '../workers/types';

/**
 * Responsible for drawing the dies inside the wafer map, adding dieText and scaling the canvas
 */
export class WorkerRenderer {
    private matrixRenderer!: Remote<MatrixRenderer>;

    public constructor(private readonly wafermap: WaferMap) {}

    public async setupWafer(snapshot: {
        canvasDimensions: Dimensions,
        state: State,
        columnIndexes: Int32Array,
        rowIndexes: Int32Array
    }): Promise<void> {
        if (this.matrixRenderer === undefined) {
            const { matrixRenderer } = await createMatrixRenderer();
            this.matrixRenderer = matrixRenderer;
            const offscreenCanvas = this.wafermap.workerCanvas.transferControlToOffscreen();
            await this.matrixRenderer.setCanvas(
                transfer(offscreenCanvas, [offscreenCanvas])
            );
        }
        await this.matrixRenderer.setCanvasDimensions(
            snapshot.canvasDimensions
        );
        await this.matrixRenderer.setState(snapshot.state);
        await this.matrixRenderer.setColumnIndexes(snapshot.columnIndexes);
        await this.matrixRenderer.setRowIndexes(snapshot.rowIndexes);
    }

    public async drawWafer(snapshot: {
        canvasDimensions: Dimensions,
        dieDimensions: Dimensions,
        transform: ZoomTransform
    }): Promise<void> {
        const topLeftCanvasCorner = snapshot.transform.invert([0, 0]);
        const bottomRightCanvasCorner = snapshot.transform.invert([
            snapshot.canvasDimensions.width,
            snapshot.canvasDimensions.height
        ]);
        await this.matrixRenderer.setTransformData({
            transform: snapshot.transform,
            topLeftCanvasCorner: {
                x: topLeftCanvasCorner[0] - snapshot.dieDimensions.width,
                y: topLeftCanvasCorner[1] - snapshot.dieDimensions.height
            },
            bottomRightCanvasCorner: {
                x: bottomRightCanvasCorner[0],
                y: bottomRightCanvasCorner[1]
            }
        });
        await this.matrixRenderer.drawWafer();
    }

    public renderHover(): void {
        if (
            this.wafermap.dieDimensions === undefined
            || this.wafermap.transform === undefined
        ) {
            return;
        }
        this.wafermap.hoverWidth = this.wafermap.dieDimensions.width * this.wafermap.transform.k;
        this.wafermap.hoverHeight = this.wafermap.dieDimensions.height * this.wafermap.transform.k;
        this.wafermap.hoverOpacity = this.wafermap.hoverDie === undefined
            ? HoverDieOpacity.hide
            : HoverDieOpacity.show;
        this.wafermap.hoverTransform = this.calculateHoverTransform();
    }

    private calculateHoverTransform(): string {
        if (this.wafermap.hoverDie !== undefined) {
            const scaledX = this.wafermap.horizontalScale(
                this.wafermap.hoverDie.x
            );
            if (scaledX === undefined) {
                return '';
            }
            const scaledY = this.wafermap.verticalScale(
                this.wafermap.hoverDie.y
            );
            if (scaledY === undefined) {
                return '';
            }
            const transformedPoint = this.wafermap.transform.apply([
                scaledX + this.wafermap.margin.left,
                scaledY + this.wafermap.margin.top
            ]);
            return `translate(${transformedPoint[0]}, ${transformedPoint[1]})`;
        }
        return '';
    }
}
