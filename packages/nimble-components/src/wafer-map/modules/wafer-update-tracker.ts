import { DOM } from '@microsoft/fast-element';
import type { WaferMap } from '..';
import { UpdateTracker } from '../../utilities/update-tracker';

/**
 * Helper class to track what updates are needed to the wafer based on configuration
 * changes.
 */
export class WaferUpdateTracker extends UpdateTracker<[
    'canvasWidth',
    'canvasHeight',
    'quadrant',
    'dies',
    'maxCharacters',
    'colorScale',
    'colorScaleMode',
    'highlightedValues',
    'dieLabelsHidden',
    'dieLabelsSuffix',
    'transform',
    'hoverDie'
]> {
    private updateQueued = false;
    public constructor(private readonly wafermap: WaferMap) {
        super([
            'canvasWidth',
            'canvasHeight',
            'quadrant',
            'dies',
            'maxCharacters',
            'colorScale',
            'colorScaleMode',
            'highlightedValues',
            'dieLabelsHidden',
            'dieLabelsSuffix',
            'transform',
            'hoverDie'
        ]);
    }

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

    protected override queueUpdate(): void {
        if (!this.wafermap.isConnected) {
            return;
        }
        if (!this.updateQueued) {
            this.updateQueued = true;
            DOM.queueUpdate(() => {
                this.wafermap.update();
                this.setAllKeys(false);
                this.updateQueued = false;
            });
        }
    }
}