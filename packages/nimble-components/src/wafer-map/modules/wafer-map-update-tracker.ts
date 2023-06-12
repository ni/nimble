import { DOM } from '@microsoft/fast-element';
import type { WaferMap } from '..';
import { UpdateTracker } from '../../utilities/models/update-tracker';

const trackedItems = [
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
] as const;

/**
 * Helper class to track what updates are needed to the wafer based on configuration
 * changes.
 */
export class WaferMapUpdateTracker extends UpdateTracker<typeof trackedItems> {
    private updateQueued = false;
    public constructor(private readonly wafermap: WaferMap) {
        super(trackedItems);
    }

    public get requiresContainerDimensionsUpdate(): boolean {
        return this.isTracked('canvasWidth') || this.isTracked('canvasHeight');
    }

    public get requiresScalesUpdate(): boolean {
        return this.isTracked('quadrant') || this.isTracked('dies');
    }

    public get requiresLabelsFontSizeUpdate(): boolean {
        return this.isTracked('maxCharacters');
    }

    public get requiresDiesRenderInfoUpdate(): boolean {
        return (
            this.isTracked('colorScale')
            || this.isTracked('colorScaleMode')
            || this.isTracked('highlightedValues')
            || this.isTracked('dieLabelsHidden')
            || this.isTracked('dieLabelsSuffix')
        );
    }

    public get requiresRenderingModuleUpdate(): boolean {
        return this.isTracked('transform');
    }

    public get requiresRenderHoverUpdate(): boolean {
        return this.isTracked('hoverDie');
    }

    protected override queueUpdate(): void {
        if (!this.wafermap.isConnected) {
            return;
        }
        if (!this.updateQueued) {
            this.updateQueued = true;
            DOM.queueUpdate(() => {
                this.wafermap.update();
                this.untrackAll();
                this.updateQueued = false;
            });
        }
    }
}
