import { DOM } from '@microsoft/fast-element';
import type { WaferMap } from '..';
import { UpdateTracker } from '../../utilities/models/update-tracker';

const trackedItems = [
    'canvasWidth',
    'canvasHeight',
    'originLocation',
    'gridMinX',
    'gridMaxX',
    'gridMinY',
    'gridMaxY',
    'dieMatrix',
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

    public get requiresEventsUpdate(): boolean {
        return (
            this.isTracked('canvasWidth')
            || this.isTracked('canvasHeight')
            || this.isTracked('originLocation')
            || this.isTracked('gridMinX')
            || this.isTracked('gridMaxX')
            || this.isTracked('gridMinY')
            || this.isTracked('gridMaxY')
            || this.isTracked('dieMatrix')
            || this.isTracked('dies')
            || this.isTracked('maxCharacters')
            || this.isTracked('colorScale')
            || this.isTracked('colorScaleMode')
            || this.isTracked('highlightedValues')
            || this.isTracked('dieLabelsHidden')
            || this.isTracked('dieLabelsSuffix')
            || this.isTracked('transform')
        );
    }

    public get requiresContainerDimensionsUpdate(): boolean {
        return this.isTracked('canvasWidth') || this.isTracked('canvasHeight');
    }

    public get requiresScalesUpdate(): boolean {
        return (
            this.isTracked('originLocation')
            || this.isTracked('gridMinX')
            || this.isTracked('gridMaxX')
            || this.isTracked('gridMinY')
            || this.isTracked('gridMaxY')
            || this.isTracked('dies')
        );
    }

    public get requiresMatrixUpdate(): boolean {
        return (
            this.isTracked('canvasWidth')
            || this.isTracked('canvasHeight')
            || this.isTracked('originLocation')
            || this.isTracked('gridMinX')
            || this.isTracked('gridMaxX')
            || this.isTracked('gridMinY')
            || this.isTracked('gridMaxY')
            || this.isTracked('dieMatrix')
            || this.isTracked('dieMatrix')
            || this.isTracked('maxCharacters')
            || this.isTracked('colorScale')
            || this.isTracked('colorScaleMode')
            || this.isTracked('highlightedValues')
            || this.isTracked('dieLabelsHidden')
            || this.isTracked('dieLabelsSuffix')
        );
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

    public get requiresRerenderUpdate(): boolean {
        return this.isTracked('transform');
    }

    public get requiresRenderHoverUpdate(): boolean {
        return this.isTracked('hoverDie');
    }

    /**
     * Queues an update using the DOM and until the update is run no other updates are queued.
     * After the update is finished, all the tracked items are reset.
     */
    public override queueUpdate(): void {
        if (!this.wafermap.$fastController.isConnected) {
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
