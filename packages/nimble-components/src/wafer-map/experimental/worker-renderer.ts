import { type Remote, transfer } from 'comlink';
import type { ZoomTransform } from 'd3-zoom';
import type { WaferMap } from '..';
import { HoverDieOpacity } from '../types';
import { createMatrixRenderer } from '../modules/create-matrix-renderer';
import type { MatrixRenderer } from '../../../build/generate-workers/dist/esm/source/matrix-renderer';
import type { Dimensions, RenderConfig } from '../workers/types';

/**
 * Responsible for drawing the dies inside the wafer map, adding dieText and scaling the canvas
 */
export class WorkerRenderer {
    /**
     * @internal
     */
    public matrixRenderer!: Remote<MatrixRenderer>;
    private readonly minDieDim = 100;

    public constructor(private readonly wafermap: WaferMap) {}

    public async setupWafer(snapshot: {
        canvasDimensions: Dimensions,
        renderConfig: RenderConfig,
        columnIndices: Int32Array,
        rowIndices: Int32Array,
        values: Float64Array
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
        await this.matrixRenderer.setRenderConfig(snapshot.renderConfig);
        await this.matrixRenderer.setColumnIndices(snapshot.columnIndices);
        await this.matrixRenderer.setRowIndices(snapshot.rowIndices);
        await this.matrixRenderer.setValues(snapshot.values);
    }

    public async drawWafer(snapshot: {
        canvasDimensions: Dimensions,
        dieDimensions: Dimensions,
        transform: ZoomTransform,
        dieLabelsHidden: boolean
    }): Promise<void> {
        const topLeftCanvasCorner = snapshot.transform.invert([0, 0]);
        const bottomRightCanvasCorner = snapshot.transform.invert([
            snapshot.canvasDimensions.width,
            snapshot.canvasDimensions.height
        ]);
        await this.matrixRenderer.setTransformConfig({
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
        if (
            !snapshot.dieLabelsHidden
            && snapshot.dieDimensions
            && snapshot.dieDimensions.width
                * snapshot.dieDimensions.height
                * (snapshot.transform.k || 1)
                >= this.minDieDim
        ) {
            await this.matrixRenderer.drawText();
        }
    }

    public renderHover(): void {
        if (
            this.wafermap.computations.dieDimensions === undefined
            || this.wafermap.transform === undefined
        ) {
            return;
        }
        this.wafermap.hoverWidth = this.wafermap.computations.dieDimensions.width
            * this.wafermap.transform.k;
        this.wafermap.hoverHeight = this.wafermap.computations.dieDimensions.height
            * this.wafermap.transform.k;
        this.wafermap.hoverOpacity = this.wafermap.hoverDie === undefined
            ? HoverDieOpacity.hide
            : HoverDieOpacity.show;
        this.wafermap.hoverTransform = this.calculateHoverTransform();
    }

    private calculateHoverTransform(): string {
        if (this.wafermap.hoverDie !== undefined) {
            const scaledX = this.wafermap.computations.horizontalScale(
                this.wafermap.hoverDie.x
            );
            if (scaledX === undefined) {
                return '';
            }
            const scaledY = this.wafermap.computations.verticalScale(
                this.wafermap.hoverDie.y
            );
            if (scaledY === undefined) {
                return '';
            }
            const transformedPoint = this.wafermap.transform.apply([
                scaledX + this.wafermap.computations.margin.left,
                scaledY + this.wafermap.computations.margin.top
            ]);
            return `translate(${transformedPoint[0]}, ${transformedPoint[1]})`;
        }
        return '';
    }
}
