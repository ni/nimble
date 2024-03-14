import type { WaferMap } from '..';
import { HoverDieOpacity } from '../types';

/**
 * Responsible for drawing the dies inside the wafer map, adding dieText and scaling the canvas
 */
export class WorkerRenderer {
    public constructor(private readonly wafermap: WaferMap) { }

    public updateSortedDiesAndDrawWafer(): void {
        // redundant function for backwards compatibility
        this.drawWafer();
    }

    public drawWafer(): void {
        const testData = {
            colIndexes: [0, 100, 100, 100, 200, 200, 200, 200, 200, 300, 300, 300, 400],
            rowIndexes: [200, 200, 100, 300, 200, 100, 0, 300, 400, 200, 100, 300, 200],
            values: [
                14.24, 76.43, 44.63, 67.93, 72.71, 79.04, 26.49, 37.79, 59.82, 52.92,
                98.53, 20.83, 62.81
            ]
        };

        // rendering will be implemented in a future PR
        this.wafermap.workerOne.setTransform(this.wafermap.transform).then(() => {
            this.wafermap.workerOne.updateMatrix(
                testData
            ).then(() => {
                this.wafermap.workerOne.drawWafer().then(() => {
                    this.renderHover();
                }, () => { });
            }, () => { });
        }, () => { });
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
