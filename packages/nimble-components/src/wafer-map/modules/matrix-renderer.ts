import type { WaferMap } from '..';
import { HoverDieOpacity } from '../types';

/**
 * Responsible for drawing the dies inside the wafer map, adding dieText and scaling the canvas
 */
export class MatrixRenderer {
    public constructor(private readonly wafermap: WaferMap) {}

    public updateSortedDiesAndDrawWafer(): void {
        // redundant function for backwards compatibility
        this.drawWafer();
    }

    public drawWafer(): void {
        // rendering will be implemented in a future PR
        this.wafermap.$emit('render-complete', {
            count: this.wafermap.diesTable?.numRows
        });
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
