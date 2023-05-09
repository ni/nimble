import type { WaferMap } from '..';
import { UpdateTracker } from '../../utilities/update-tracker';

/**
 * Helper class to track what updates are needed to the wafer based on configuration
 * changes.
 */
export class WaferUpdateTracker extends UpdateTracker<WaferMap> {
    public trackQuadrantChanged(): void {
        this.requiredUpdates.quadrant = true;
        this.queueUpdate();
    }

    public trackOrientationChanged(): void {
        this.requiredUpdates.orientation = true;
        this.queueUpdate();
    }

    public trackMaxCharactersChanged(): void {
        this.requiredUpdates.maxCharacters = true;
        this.queueUpdate();
    }

    public trackDieLabelsHiddenChanged(): void {
        this.requiredUpdates.dieLabelsHidden = true;
        this.queueUpdate();
    }

    public trackDieLabelsSuffixChanged(): void {
        this.requiredUpdates.dieLabelsSuffix = true;
        this.queueUpdate();
    }

    public trackColorScaleModeChanged(): void {
        this.requiredUpdates.colorScaleMode = true;
        this.queueUpdate();
    }

    public trackHighlightedValuesChanged(): void {
        this.requiredUpdates.highlightedValues = true;
        this.queueUpdate();
    }

    public trackDiesChanged(): void {
        this.requiredUpdates.dies = true;
        this.queueUpdate();
    }

    public trackColorScaleChanged(): void {
        this.requiredUpdates.colorScale = true;
        this.queueUpdate();
    }

    public trackTransformChanged(): void {
        this.requiredUpdates.transform = true;
        this.queueUpdate();
    }

    public trackCanvasWidthChanged(): void {
        this.requiredUpdates.canvasWidth = true;
        this.queueUpdate();
    }

    public trackCanvasHeightChanged(): void {
        this.requiredUpdates.canvasHeight = true;
        this.queueUpdate();
    }

    public trackHoverDieChanged(): void {
        this.requiredUpdates.hoverDie = true;
        this.queueUpdate();
    }

    public get updateHoverPosition(): boolean | undefined {
        return this.requiredUpdates.hoverDie;
    }
}