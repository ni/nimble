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
    WaferMapQuadrant
} from './types';
import { WaferUpdateTracker } from './modules/wafer-update-tracker';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-wafer-map': WaferMap;
    }
}

/**
 * A nimble-styled WaferMap
 */
export class WaferMap extends FoundationElement {
    @attr
    public quadrant: WaferMapQuadrant = WaferMapQuadrant.topLeft;

    @attr
    public orientation: WaferMapOrientation = WaferMapOrientation.top;

    @attr({
        attribute: 'max-characters',
        converter: nullableNumberConverter
    })
    public maxCharacters = 4;

    @attr({
        attribute: 'die-labels-hidden',
        mode: 'boolean'
    })
    public dieLabelsHidden = false;

    @attr({
        attribute: 'die-labels-suffix'
    })
    public dieLabelsSuffix = '';

    @attr({
        attribute: 'color-scale-mode'
    })
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
    public dataManager?: DataManager;
    /**
     * @internal
     */
    public renderer?: RenderingModule;

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

    private eventCoordinator?: EventCoordinator;
    private resizeObserver?: ResizeObserver;
    private readonly waferUpdateTracker = new WaferUpdateTracker(this);

    public override connectedCallback(): void {
        super.connectedCallback();
        this.canvasContext = this.canvas.getContext('2d', {
            willReadFrequently: true
        })!;
        this.waferUpdateTracker?.trackAllStateChanged();
        this.resizeObserver = this.createResizeObserver();
    }

    public override disconnectedCallback(): void {
        super.disconnectedCallback();
        this.resizeObserver!.unobserve(this);
    }

    /**
     * @internal
     */
    public update(): void {
        if (this.waferUpdateTracker.update('hoverDie')) {
            this.renderer?.renderHover();
        } else {
            this.eventCoordinator?.detachEvents();
            this.dataManager = new DataManager(this);
            this.renderer = new RenderingModule(this);
            this.eventCoordinator = new EventCoordinator(this);
            this.renderer?.drawWafer();
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
        resizeObserver.observe(this);
        return resizeObserver;
    }

    private quadrantChanged(): void {
        this.waferUpdateTracker.track('quadrant');
    }

    private orientationChanged(): void {
        this.waferUpdateTracker.track('orientation');
    }

    private maxCharactersChanged(): void {
        this.waferUpdateTracker.track('maxCharacters');
    }

    private dieLabelsHiddenChanged(): void {
        this.waferUpdateTracker.track('dieLabelsHidden');
    }

    private dieLabelsSuffixChanged(): void {
        this.waferUpdateTracker.track('dieLabelsSuffix');
    }

    private colorScaleModeChanged(): void {
        this.waferUpdateTracker.track('colorScaleMode');
    }

    private highlightedValuesChanged(): void {
        this.waferUpdateTracker.track('highlightedValues');
    }

    private diesChanged(): void {
        this.waferUpdateTracker.track('dies');
    }

    private colorScaleChanged(): void {
        this.waferUpdateTracker.track('colorScale');
    }

    private transformChanged(): void {
        this.waferUpdateTracker.track('transform');
    }

    private canvasWidthChanged(): void {
        this.waferUpdateTracker.track('canvasWidth');
    }

    private canvasHeightChanged(): void {
        this.waferUpdateTracker.track('canvasHeight');
    }

    private hoverDieChanged(): void {
        this.$emit('die-hover', { currentDie: this.hoverDie });
        this.waferUpdateTracker.track('hoverDie');
    }
}

const nimbleWaferMap = WaferMap.compose({
    baseName: 'wafer-map',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleWaferMap());
export const waferMapTag = DesignSystem.tagFor(WaferMap);
