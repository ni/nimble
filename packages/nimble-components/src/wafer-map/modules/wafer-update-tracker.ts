import type { WaferMap } from '..';
import { UpdateTracker } from '../../utilities/update-tracker';

/**
 * Helper class to track what updates are needed to the wafer based on configuration
 * changes.
 */
export class WaferUpdateTracker extends UpdateTracker<WaferMap> {
    public get requiresContainerDimensionsUpdate(): boolean {
        return (
            this.requiredUpdates.canvasWidth
            || this.requiredUpdates.canvasHeight
        );
    }

    public get requiresScalesUpdate(): boolean {
        return (
            this.requiredUpdates.quadrant
            || this.requiredUpdates.dies
        );
    }

    public get requiresLabelsFontSizeUpdate(): boolean {
        return (
            this.requiredUpdates.maxCharacters
        );
    }

    public get requiresDiesRenderInfoUpdate(): boolean {
        return (
            this.requiredUpdates.colorScale
            || this.requiredUpdates.colorScaleMode
            || this.requiredUpdates.highlightedValues
            || this.requiredUpdates.dieLabelsHidden
            || this.requiredUpdates.dieLabelsSuffix
        );
    }

    public get requiresRenderingModuleUpdate(): boolean {
        return (
            this.requiredUpdates.transform
        );
    }

    public get requiresRenderHoverUpdate(): boolean {
        return (
            this.requiredUpdates.hoverDie
        );
    }
}