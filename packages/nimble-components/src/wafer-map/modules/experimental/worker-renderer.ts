import type { WaferMap } from '../..';
import { HoverDieOpacity } from '../../types';

/**
 * Responsible for drawing the dies inside the wafer map, adding dieText and scaling the canvas
 */
export class WorkerRenderer {
    public constructor(private readonly wafermap: WaferMap) {}

    public drawWafer(): void {
        // rendering will be implemented in a future PR
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
