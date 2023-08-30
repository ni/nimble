import {
    attr,
    nullableNumberConverter,
    observable
} from '@microsoft/fast-element';
import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import { zoomIdentity, ZoomTransform } from 'd3-zoom';
import { template } from './template';
import { styles } from './styles';
import { DataManager } from './modules/data-manager';
import { RenderingModule } from './modules/rendering';
import { EventCoordinator } from './modules/event-coordinator';
import {
    HoverDieOpacity,
    WaferMapColorScale,
    WaferMapColorScaleMode,
    WaferMapDie,
    WaferMapOrientation,
    WaferMapOriginLocation
} from './types';
import { WaferMapUpdateTracker } from './modules/wafer-map-update-tracker';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-wafer-map': WaferMap;
    }
}

/**
 * A nimble-styled WaferMap
 */
export class WaferMap extends FoundationElement {
    /**
     * @internal
     * needs to be initialized before the properties trigger changes
     */
    public readonly waferMapUpdateTracker = new WaferMapUpdateTracker(this);

    @attr({ attribute: 'origin-location' })
    public originLocation: WaferMapOriginLocation = WaferMapOriginLocation.bottomLeft;

    @attr
    public orientation: WaferMapOrientation = WaferMapOrientation.top;

    @attr({ attribute: 'max-characters', converter: nullableNumberConverter })
    public maxCharacters = 4;

    @attr({ attribute: 'die-labels-hidden', mode: 'boolean' })
    public dieLabelsHidden = false;

    @attr({ attribute: 'die-labels-suffix' })
    public dieLabelsSuffix = '';

    @attr({ attribute: 'color-scale-mode' })
    public colorScaleMode: WaferMapColorScaleMode = WaferMapColorScaleMode.linear;

    /**
     * @internal
     */
    public readonly canvas!: HTMLCanvasElement;

    /**
     * @internal
     */
    public canvasContext!: CanvasRenderingContext2D;

    /**
     * @internal
     */
    public readonly zoomContainer!: HTMLElement;

    /**
     * @internal
     */
    public readonly dataManager = new DataManager(this);
    /**
     * @internal
     */
    public readonly renderer = new RenderingModule(this);

    /**
     * @internal
     */
    public renderQueued = false;

    /**
     * @internal
     */
    @observable public canvasWidth!: number;

    /**
     * @internal
     */
    @observable public canvasHeight!: number;

    /**
     * @internal
     */
    @observable public transform: ZoomTransform = zoomIdentity;

    /**
     * @internal
     */
    @observable public hoverTransform = '';

    /**
     * @internal
     */
    @observable public hoverOpacity: HoverDieOpacity = HoverDieOpacity.hide;

    /**
     * @internal
     */
    @observable public hoverWidth = 0;

    /**
     * @internal
     */
    @observable public hoverHeight = 0;

    /**
     * @internal
     */
    @observable public hoverDie: WaferMapDie | undefined;

    @observable public highlightedValues: string[] = [];
    @observable public dies: WaferMapDie[] = [];
    @observable public colorScale: WaferMapColorScale = {
        colors: [],
        values: []
    };

    private readonly eventCoordinator = new EventCoordinator(this);
    private readonly resizeObserver = this.createResizeObserver();

    public override connectedCallback(): void {
        super.connectedCallback();
        this.canvasContext = this.canvas.getContext('2d', {
            willReadFrequently: true
        })!;
        this.resizeObserver.observe(this);
        this.waferMapUpdateTracker.trackAll();
    }

    public override disconnectedCallback(): void {
        super.disconnectedCallback();
        this.resizeObserver.unobserve(this);
    }

    /**
     * @internal
     * Update function called when an update is queued.
     * It will check which updates are needed based on which properties have changed.
     * Each update represents a different starting point of the same sequential update flow.
     * The updates snowball one after the other, this function only choses the 'altitude'.
     * The hover does not require an event update, but it's also the last update in the sequence.
     */
    public update(): void {
        if (this.waferMapUpdateTracker.requiresEventsUpdate) {
            this.eventCoordinator.detachEvents();
            if (this.waferMapUpdateTracker.requiresContainerDimensionsUpdate) {
                this.dataManager.updateContainerDimensions();
                this.renderer.updateSortedDiesAndDrawWafer();
            } else if (this.waferMapUpdateTracker.requiresScalesUpdate) {
                this.dataManager.updateScales();
                this.renderer.updateSortedDiesAndDrawWafer();
            } else if (
                this.waferMapUpdateTracker.requiresLabelsFontSizeUpdate
            ) {
                this.dataManager.updateLabelsFontSize();
                this.renderer.updateSortedDiesAndDrawWafer();
            } else if (
                this.waferMapUpdateTracker.requiresDiesRenderInfoUpdate
            ) {
                this.dataManager.updateDiesRenderInfo();
                this.renderer.updateSortedDiesAndDrawWafer();
            } else if (this.waferMapUpdateTracker.requiresDrawnWaferUpdate) {
                this.renderer.drawWafer();
            }
            this.eventCoordinator.attachEvents();
        } else if (this.waferMapUpdateTracker.requiresRenderHoverUpdate) {
            this.renderer.renderHover();
        }
    }

    private createResizeObserver(): ResizeObserver {
        const resizeObserver = new ResizeObserver(entries => {
            const entry = entries[0];
            if (entry === undefined) {
                return;
            }
            const { height, width } = entry.contentRect;
            // Updating the canvas size clears its contents so update it explicitly instead of
            // via template bindings so we can confirm that it happens before render
            this.canvas.width = width;
            this.canvas.height = height;
            this.canvasWidth = width;
            this.canvasHeight = height;
        });
        return resizeObserver;
    }

    private originLocationChanged(): void {
        this.waferMapUpdateTracker.track('originLocation');
        this.waferMapUpdateTracker.queueUpdate();
    }

    private maxCharactersChanged(): void {
        this.waferMapUpdateTracker.track('maxCharacters');
        this.waferMapUpdateTracker.queueUpdate();
    }

    private dieLabelsHiddenChanged(): void {
        this.waferMapUpdateTracker.track('dieLabelsHidden');
        this.waferMapUpdateTracker.queueUpdate();
    }

    private dieLabelsSuffixChanged(): void {
        this.waferMapUpdateTracker.track('dieLabelsSuffix');
        this.waferMapUpdateTracker.queueUpdate();
    }

    private colorScaleModeChanged(): void {
        this.waferMapUpdateTracker.track('colorScaleMode');
        this.waferMapUpdateTracker.queueUpdate();
    }

    private highlightedValuesChanged(): void {
        this.waferMapUpdateTracker.track('highlightedValues');
        this.waferMapUpdateTracker.queueUpdate();
    }

    private diesChanged(): void {
        this.waferMapUpdateTracker.track('dies');
        this.waferMapUpdateTracker.queueUpdate();
    }

    private colorScaleChanged(): void {
        this.waferMapUpdateTracker.track('colorScale');
        this.waferMapUpdateTracker.queueUpdate();
    }

    private transformChanged(): void {
        this.waferMapUpdateTracker.track('transform');
        this.waferMapUpdateTracker.queueUpdate();
    }

    private canvasWidthChanged(): void {
        this.waferMapUpdateTracker.track('canvasWidth');
        this.waferMapUpdateTracker.queueUpdate();
    }

    private canvasHeightChanged(): void {
        this.waferMapUpdateTracker.track('canvasHeight');
        this.waferMapUpdateTracker.queueUpdate();
    }

    private hoverDieChanged(): void {
        this.$emit('die-hover', { currentDie: this.hoverDie });
        this.waferMapUpdateTracker.track('hoverDie');
        this.waferMapUpdateTracker.queueUpdate();
    }
}

const nimbleWaferMap = WaferMap.compose({
    baseName: 'wafer-map',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleWaferMap());
export const waferMapTag = DesignSystem.tagFor(WaferMap);
