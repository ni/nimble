import { transfer } from 'comlink';
import type { WaferMap } from '../..';
import { HoverDieOpacity } from '../../types';

/**
 * Responsible for drawing the dies inside the wafer map, adding dieText and scaling the canvas
 */
export class WorkerRenderer {
    public constructor(private readonly wafermap: WaferMap) { }

    public async updateSortedDiesAndDrawWafer(): Promise<void> {
        if (this.wafermap.diesTable === undefined || this.wafermap.worker === undefined) {
            return;
        }
        await this.setupWorker();
        const colIndexes = Int32Array.from(this.wafermap.diesTable.getChild('colIndex')!.toArray());
        const rowIndexes = Int32Array.from(this.wafermap.diesTable.getChild('rowIndex')!.toArray());
        const values = Float64Array.from(this.wafermap.diesTable.getChild('value')!.toArray());
        await this.wafermap.worker.setColIndexes(transfer(colIndexes, [colIndexes.buffer]));
        await this.wafermap.worker.setRowIndexes(transfer(rowIndexes, [rowIndexes.buffer]));
        await this.wafermap.worker.setValues(transfer(values, [values.buffer]));
        await this.drawWafer();
    }

    public async drawWafer(): Promise<void> {
        if (this.wafermap.diesTable === undefined || this.wafermap.worker === undefined) {
            return;
        }
        await this.wafermap.worker.setTransform(this.wafermap.transform);
        await this.wafermap.worker.drawWafer();
        this.renderHover();
    }

    public renderHover(): void {
        this.wafermap.hoverWidth = this.wafermap.dataManager.dieDimensions.width
            * this.wafermap.transform.k;
        this.wafermap.hoverHeight = this.wafermap.dataManager.dieDimensions.height
            * this.wafermap.transform.k;
        this.wafermap.hoverOpacity = this.wafermap.hoverDie === undefined
            ? HoverDieOpacity.hide
            : HoverDieOpacity.show;
        this.wafermap.hoverTransform = this.calculateHoverTransform();
    }

    private async setupWorker(): Promise<void> {
        // await this.wafermap.worker.setCanvasDimensions({ width: this.wafermap.canvasWidth, height: this.wafermap.canvasHeight });
        console.log('this.wafermap.dataManager.dieDimensions', this.wafermap.dataManager.dieDimensions);
        await this.wafermap.worker.setDiesDimensions(this.wafermap.dataManager.dieDimensions);

        const scaleX = this.wafermap.dataManager.horizontalScale(1)!
            - this.wafermap.dataManager.horizontalScale(0)!;
        const scaleY = this.wafermap.dataManager.verticalScale(1)!
            - this.wafermap.dataManager.verticalScale(0)!;
        await this.wafermap.worker.setScaling(scaleX, scaleY);

        await this.wafermap.worker.setBases(
            this.wafermap.dataManager.horizontalScale(0)!,
            this.wafermap.dataManager.verticalScale(0)!
        );
        await this.wafermap.worker.setMargin(this.wafermap.dataManager.margin);

        const topLeftCanvasCorner = this.wafermap.transform.invert([0, 0]);
        const bottomRightCanvasCorner = this.wafermap.transform.invert([
            this.wafermap.workerCanvas.width,
            this.wafermap.workerCanvas.height
        ]);
        await this.wafermap.worker.setCanvasCorners(
            {
                x: topLeftCanvasCorner[0],
                y: topLeftCanvasCorner[1]
            },
            {
                x: bottomRightCanvasCorner[0],
                y: bottomRightCanvasCorner[1]
            }
        );
    }

    private calculateHoverTransform(): string {
        if (this.wafermap.hoverDie !== undefined) {
            const scaledX = this.wafermap.dataManager.horizontalScale(
                this.wafermap.hoverDie.x
            );
            if (scaledX === undefined) {
                return '';
            }
            const scaledY = this.wafermap.dataManager.verticalScale(
                this.wafermap.hoverDie.y
            );
            if (scaledY === undefined) {
                return '';
            }
            const transformedPoint = this.wafermap.transform.apply([
                scaledX + this.wafermap.dataManager.margin.left,
                scaledY + this.wafermap.dataManager.margin.top
            ]);
            return `translate(${transformedPoint[0]}, ${transformedPoint[1]})`;
        }
        return '';
    }
}
