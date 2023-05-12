import type { WaferMap } from '..';
import { UpdateTracker } from '../../utilities/update-tracker';

/**
 * Helper class to track what updates are needed to the wafer based on configuration
 * changes.
 */
export class WaferUpdateTracker extends UpdateTracker<WaferMap> {
    public get requiresDataManagerUpdate(): boolean {
        return (
            this.requiredUpdates.canvasWidth
            || this.requiredUpdates.canvasHeight
            || this.requiredUpdates.quadrant
            || this.requiredUpdates.dies
            || this.requiredUpdates.maxCharacters
            || this.requiredUpdates.colorScale
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