import { transfer } from 'comlink';
import type { WaferMap } from '../..';
import { HoverDieOpacity } from '../../types';
import { DataManager } from './data-manager';

/**
 * Responsible for drawing the dies inside the wafer map, adding dieText and scaling the canvas
 */
export class WorkerRenderer {
    private readonly minDieDim = 50;
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
        if (!this.wafermap.dieLabelsHidden
            || this.wafermap.dataManager.dieDimensions.width
            * this.wafermap.dataManager.dieDimensions.height
            * (this.wafermap.transform.k || 1) >= this.minDieDim) {
            await this.wafermap.worker.renderText();
        }
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
        await this.wafermap.worker.setFontSize(this.wafermap.dataManager.labelsFontSize);
        await this.wafermap.worker.setMaxCharacters(this.wafermap.maxCharacters);
        await this.wafermap.worker.setDieLabelsSuffix(this.wafermap.dieLabelsSuffix);
        if (this.wafermap.dataManager instanceof DataManager) {
            await this.wafermap.worker.setColors(this.wafermap.dataManager.colorScale.colors);
            await this.wafermap.worker.setColorValues(this.wafermap.dataManager.colorScale.values);
        }
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
