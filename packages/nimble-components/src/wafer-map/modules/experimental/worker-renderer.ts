import { type Remote, transfer } from 'comlink';
import type { WaferMap } from '../..';
import { HoverDieOpacity } from '../../types';
import { createMatrixRenderer } from '../create-matrix-renderer';
import type { MatrixRenderer } from '../../../../build/generate-workers/dist/esm/source/matrix-renderer';

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
            this.wafermap.experimentalDataManager.dieDimensions
        );
        const scaleX = this.wafermap.experimentalDataManager.horizontalScale(1)!
            - this.wafermap.experimentalDataManager.horizontalScale(0)!;
        const scaleY = this.wafermap.experimentalDataManager.verticalScale(1)!
            - this.wafermap.experimentalDataManager.verticalScale(0)!;
        await this.matrixRenderer.setScaling(scaleX, scaleY);
        await this.matrixRenderer.setBases(
            this.wafermap.experimentalDataManager.horizontalScale(0)!,
            this.wafermap.experimentalDataManager.verticalScale(0)!
        );
        await this.matrixRenderer.setMargin(
            this.wafermap.experimentalDataManager.margin
        );

        if (this.wafermap.diesTable !== undefined) {
            const columnIndexes = this.wafermap.diesTable
                .getChild('colIndex')!
                .toArray();
            await this.matrixRenderer.setColumnIndexes(columnIndexes);

            const rowIndexes = this.wafermap.diesTable
                .getChild('rowIndex')!
                .toArray();
            await this.matrixRenderer.setRowIndexes(rowIndexes);
        }
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
                    - this.wafermap.experimentalDataManager.dieDimensions.width,
                y:
                    topLeftCanvasCorner[1]
                    - this.wafermap.experimentalDataManager.dieDimensions.height
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
        this.wafermap.hoverWidth = this.wafermap.experimentalDataManager.dieDimensions.width
            * this.wafermap.transform.k;
        this.wafermap.hoverHeight = this.wafermap.experimentalDataManager.dieDimensions.height
            * this.wafermap.transform.k;
        this.wafermap.hoverOpacity = this.wafermap.hoverDie === undefined
            ? HoverDieOpacity.hide
            : HoverDieOpacity.show;
        this.wafermap.hoverTransform = this.calculateHoverTransform();
    }

    private calculateHoverTransform(): string {
        if (this.wafermap.hoverDie !== undefined) {
            const scaledX = this.wafermap.experimentalDataManager.horizontalScale(
                this.wafermap.hoverDie.x
            );
            if (scaledX === undefined) {
                return '';
            }
            const scaledY = this.wafermap.experimentalDataManager.verticalScale(
                this.wafermap.hoverDie.y
            );
            if (scaledY === undefined) {
                return '';
            }
            const transformedPoint = this.wafermap.transform.apply([
                scaledX + this.wafermap.experimentalDataManager.margin.left,
                scaledY + this.wafermap.experimentalDataManager.margin.top
            ]);
            return `translate(${transformedPoint[0]}, ${transformedPoint[1]})`;
        }
        return '';
    }
}
