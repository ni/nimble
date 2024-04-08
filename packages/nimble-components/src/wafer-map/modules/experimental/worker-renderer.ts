import { transfer } from 'comlink';
import type { WaferMap } from '../..';
import { HoverDieOpacity } from '../../types';

/**
 * Responsible for drawing the dies inside the wafer map, adding dieText and scaling the canvas
 */
export class WorkerRenderer {
    public constructor(private readonly wafermap: WaferMap) {}

    public async updateSortedDies(): Promise<void> {
        if (this.wafermap.diesTable === undefined) {
            return;
        }
        await this.setupWorker();
        const columnIndexes = Int32Array.from(
            this.wafermap.diesTable.getChild('colIndex')!.toArray()
        );
        const rowIndexes = Int32Array.from(
            this.wafermap.diesTable.getChild('rowIndex')!.toArray()
        );
        await this.wafermap.worker.setColumnIndexes(
            transfer(columnIndexes, [columnIndexes.buffer])
        );
        await this.wafermap.worker.setRowIndexes(
            transfer(rowIndexes, [rowIndexes.buffer])
        );
    }

    public async drawWafer(): Promise<void> {
        if (this.wafermap.diesTable === undefined) {
            return;
        }
        await this.wafermap.worker.setTransform(this.wafermap.transform);
        const topLeftCanvasCorner = this.wafermap.transform.invert([0, 0]);
        const bottomRightCanvasCorner = this.wafermap.transform.invert([
            this.wafermap.canvasWidth,
            this.wafermap.canvasHeight
        ]);
        await this.wafermap.worker.setCanvasCorners(
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
        await this.wafermap.worker.drawWafer();
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

    private async setupWorker(): Promise<void> {
        if (
            this.wafermap.isWorkerAlive
            || !this.wafermap.isExperimentalUpdate()
        ) {
            return;
        }

        this.wafermap.isWorkerAlive = true;
        await this.wafermap.createWorker();
        await this.wafermap.createWorkerCanvas();
        await this.wafermap.worker.setCanvasDimensions({
            width: this.wafermap.canvasWidth,
            height: this.wafermap.canvasHeight
        });
        await this.wafermap.worker.setDiesDimensions(
            this.wafermap.experimentalDataManager.dieDimensions
        );

        const scaleX = this.wafermap.experimentalDataManager.horizontalScale(1)!
            - this.wafermap.experimentalDataManager.horizontalScale(0)!;
        const scaleY = this.wafermap.experimentalDataManager.verticalScale(1)!
            - this.wafermap.experimentalDataManager.verticalScale(0)!;
        await this.wafermap.worker.setScaling(scaleX, scaleY);

        await this.wafermap.worker.setBases(
            this.wafermap.experimentalDataManager.horizontalScale(0)!,
            this.wafermap.experimentalDataManager.verticalScale(0)!
        );
        await this.wafermap.worker.setMargin(
            this.wafermap.experimentalDataManager.margin
        );
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
