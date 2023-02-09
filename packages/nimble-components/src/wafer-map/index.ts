import {
    attr,
    DOM,
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
    WaferMapColorScale,
    WaferMapColorScaleMode,
    WaferMapDie,
    WaferMapOrientation,
    WaferMapQuadrant
} from './types';

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
    public readonly zoomContainer!: HTMLElement;

    /**
     * @internal
     */
    public readonly rect!: HTMLElement;

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
    @observable public transform: ZoomTransform = zoomIdentity;

    @observable public highlightedValues: string[] = [];
    @observable public dies: WaferMapDie[] = [];
    @observable public colorScale: WaferMapColorScale = {
        colors: [],
        values: []
    };

    private eventCoordinator?: EventCoordinator;
    private resizeObserver?: ResizeObserver;

    public override connectedCallback(): void {
        super.connectedCallback();
        this.resizeObserver = this.createResizeObserver();
        this.queueRender();
    }

    public override disconnectedCallback(): void {
        super.disconnectedCallback();
        this.resizeObserver!.unobserve(this);
    }

    /**
     * @internal
     */
    public render(): void {
        this.renderQueued = false;
        this.initializeInternalModules();
        this.renderer?.drawWafer();
    }

    private queueRender(): void {
        if (!this.$fastController.isConnected) {
            return;
        }
        if (!this.renderQueued) {
            this.renderQueued = true;
            DOM.queueUpdate(() => this.render());
        }
    }

    private initializeInternalModules(): void {
        this.eventCoordinator?.detachEvents();
        this.dataManager = new DataManager(this);
        this.renderer = new RenderingModule(this);
        this.eventCoordinator = new EventCoordinator(this);
    }

    private createResizeObserver(): ResizeObserver {
        const resizeObserver = new ResizeObserver(entries => {
            const entry = entries[0];
            if (entry === undefined) {
                return;
            }
            const { height, width } = entry.contentRect;
            this.canvas.width = width;
            this.canvas.height = height;
            this.queueRender();
        });
        resizeObserver.observe(this);
        return resizeObserver;
    }

    private readonly emitDieSelected = (die: WaferMapDie): void => {
        this.$emit('die-selected', { detail: { die } });
    };

    private quadrantChanged(): void {
        this.queueRender();
    }

    private orientationChanged(): void {
        this.queueRender();
    }

    private maxCharactersChanged(): void {
        this.queueRender();
    }

    private dieLabelsHiddenChanged(): void {
        this.queueRender();
    }

    private dieLabelsSuffixChanged(): void {
        this.queueRender();
    }

    private colorScaleModeChanged(): void {
        this.queueRender();
    }

    private highlightedValuesChanged(): void {
        this.queueRender();
    }

    private diesChanged(): void {
        this.queueRender();
    }

    private colorScaleChanged(): void {
        this.queueRender();
    }

    private transformChanged(): void {
        this.queueRender();
    }
}

const nimbleWaferMap = WaferMap.compose({
    baseName: 'wafer-map',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleWaferMap());
