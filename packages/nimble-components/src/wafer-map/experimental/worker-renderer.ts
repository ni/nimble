import { type Remote, transfer } from 'comlink';
import type { WaferMap } from '..';
import { HoverDieOpacity } from '../types';
import { createMatrixRenderer } from '../modules/create-matrix-renderer';
import type { MatrixRenderer } from '../../../build/generate-workers/dist/esm/source/matrix-renderer';

/**
 * Responsible for drawing the dies inside the wafer map, adding dieText and scaling the canvas
 */
export class WorkerRenderer {
    private matrixRenderer!: Remote<MatrixRenderer>;

    public constructor(private readonly wafermap: WaferMap) {}

    public async setupWafer(): Promise<void> {
        if (this.matrixRenderer === undefined) {
            const { matrixRenderer } = await createMatrixRenderer();
            this.matrixRenderer = matrixRenderer;
            const offscreenCanvas = this.wafermap.workerCanvas.transferControlToOffscreen();
            await this.matrixRenderer.setCanvas(
                transfer(offscreenCanvas, [offscreenCanvas])
            );
        }

        await this.matrixRenderer.setCanvasDimensions({
            width: this.wafermap.canvasWidth ?? 0,
            height: this.wafermap.canvasHeight ?? 0
        });
        await this.matrixRenderer.setDiesDimensions(
            this.wafermap.state.dieDimensions!
        );
        const scaleX = this.wafermap.horizontalScale!(1)!
            - this.wafermap.horizontalScale!(0)!;
        const scaleY = this.wafermap.verticalScale!(1)!
            - this.wafermap.verticalScale!(0)!;
        await this.matrixRenderer.setScaling(scaleX, scaleY);
        await this.matrixRenderer.setBases(
            this.wafermap.horizontalScale!(0)!,
            this.wafermap.verticalScale!(0)!
        );
        await this.matrixRenderer.setMargin(
            this.wafermap.state.margin!
        );

        if (this.wafermap.diesTable === undefined) {
            await this.matrixRenderer.setColumnIndexes(Int32Array.from([]));
            await this.matrixRenderer.setRowIndexes(Int32Array.from([]));
            return;
        }

        const columnIndexes = this.wafermap.diesTable
            .getChild('colIndex')!
            .toArray();
        await this.matrixRenderer.setColumnIndexes(columnIndexes);

        const rowIndexes = this.wafermap.diesTable
            .getChild('rowIndex')!
            .toArray();
        await this.matrixRenderer.setRowIndexes(rowIndexes);
    }

    public async drawWafer(): Promise<void> {
        await this.matrixRenderer.setTransform(this.wafermap.transform);
        const topLeftCanvasCorner = this.wafermap.transform.invert([0, 0]);
        const bottomRightCanvasCorner = this.wafermap.transform.invert([
            this.wafermap.canvasWidth,
            this.wafermap.canvasHeight
        ]);
        await this.matrixRenderer.setCanvasCorners(
            {
                x:
                    topLeftCanvasCorner[0]
                    - this.wafermap.state.dieDimensions!.width,
                y:
                    topLeftCanvasCorner[1]
                    - this.wafermap.state.dieDimensions!.height
            },
            {
                x: bottomRightCanvasCorner[0],
                y: bottomRightCanvasCorner[1]
            }
        );
        await this.matrixRenderer.drawWafer();
        this.renderHover();
    }

    public renderHover(): void {
        this.wafermap.hoverWidth = this.wafermap.state.dieDimensions!.width
            * this.wafermap.transform.k;
        this.wafermap.hoverHeight = this.wafermap.state.dieDimensions!.height
            * this.wafermap.transform.k;
        this.wafermap.hoverOpacity = this.wafermap.hoverDie === undefined
            ? HoverDieOpacity.hide
            : HoverDieOpacity.show;
        this.wafermap.hoverTransform = this.calculateHoverTransform();
    }

    private calculateHoverTransform(): string {
        if (this.wafermap.hoverDie !== undefined) {
            const scaledX = this.wafermap.horizontalScale!(
                this.wafermap.hoverDie.x
            );
            if (scaledX === undefined) {
                return '';
            }
            const scaledY = this.wafermap.verticalScale!(
                this.wafermap.hoverDie.y
            );
            if (scaledY === undefined) {
                return '';
            }
            const transformedPoint = this.wafermap.transform.apply([
                scaledX + this.wafermap.state.margin!.left,
                scaledY + this.wafermap.state.margin!.top
            ]);
            return `translate(${transformedPoint[0]}, ${transformedPoint[1]})`;
        }
        return '';
    }
}
