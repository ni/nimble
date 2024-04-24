import { DOM } from '@microsoft/fast-element';
import type { WaferMap } from '..';
import { UpdateTracker } from '../../utilities/models/update-tracker';

const trackedItems = [
    'highlightedTags',
    'canvasWidth',
    'canvasHeight',
    'originLocation',
    'gridMinX',
    'gridMaxX',
    'gridMinY',
    'gridMaxY',
    'dies',
    'maxCharacters',
    'colorScale',
    'colorScaleMode',
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
            this.isTracked('highlightedTags')
            || this.isTracked('canvasWidth')
            || this.isTracked('canvasHeight')
            || this.isTracked('originLocation')
            || this.isTracked('gridMinX')
            || this.isTracked('gridMaxX')
            || this.isTracked('gridMinY')
            || this.isTracked('gridMaxY')
            || this.isTracked('dies')
            || this.isTracked('maxCharacters')
            || this.isTracked('colorScale')
            || this.isTracked('colorScaleMode')
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

    public get requiresLabelsFontSizeUpdate(): boolean {
        return this.isTracked('maxCharacters');
    }

    public get requiresDiesRenderInfoUpdate(): boolean {
        return (
            this.isTracked('highlightedTags')
            || this.isTracked('colorScale')
            || this.isTracked('colorScaleMode')
            || this.isTracked('dieLabelsHidden')
            || this.isTracked('dieLabelsSuffix')
        );
    }

    public get requiresDrawnWaferUpdate(): boolean {
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
        if (!this.wafermap.$fastController.isConnected || this.updateQueued) {
            return;
        }
        this.updateQueued = true;
        if (this.wafermap.currentTask === undefined) {
            DOM.queueUpdate(() => {
                this.wafermap.update();
                this.untrackAll();
                this.updateQueued = false;
            });
        } else {
            void (async () => {
                await this.wafermap.currentTask;
                DOM.queueUpdate(() => {
                    this.wafermap.update();
                    this.untrackAll();
                    this.updateQueued = false;
                    this.wafermap.currentTask = undefined;
                });
            })();
        }
    }
}
