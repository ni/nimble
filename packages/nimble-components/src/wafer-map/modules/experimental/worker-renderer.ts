import type { WaferMap } from '../..';
import { HoverDieOpacity } from '../../types';

/**
 * Responsible for drawing the dies inside the wafer map, adding dieText and scaling the canvas
 */
export class WorkerRenderer {
    public constructor(private readonly wafermap: WaferMap) {}

    public updateSortedDiesAndDrawWafer(): void {
        // redundant function for backwards compatibility
        void this.drawWafer();
    }

    public async drawWafer(): Promise<void> {
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
