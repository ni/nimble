import {
    attr,
    DOM,
    nullableNumberConverter,
    observable
} from '@microsoft/fast-element';
import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import { template } from './template';
import { styles } from './styles';
import {
    WaferMapColorScale,
    WaferMapColorScaleMode,
    WaferMapDie,
    WaferMapOrientation,
    WaferMapQuadrant
} from './types';
import { DataManager } from './modules/data-manager';
import { RenderingModule } from './modules/rendering';
import { EventHandler } from './modules/event-handler';

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

    @observable public highlightedValues: string[] = [];
    @observable public dies: WaferMapDie[] = [];
    @observable public colorScale: WaferMapColorScale = {
        colors: [],
        values: []
    };

    public get lastSelectedDie(): WaferMapDie | undefined {
        return this.eventHandler?.lastSelectedDie;
    }

    private renderQueued = false;
    private dataManager?: DataManager;
    private renderer?: RenderingModule;
    private eventHandler?: EventHandler;
    private resizeObserver?: ResizeObserver;
    public override connectedCallback(): void {
        super.connectedCallback();
        this.resizeObserver = new ResizeObserver(entries => {
            const entry = entries[0];
            if (entry === undefined) {
                return;
            }
            const { height, width } = entry.contentRect;
            this.canvas.width = width;
            this.canvas.height = height;

            this.eventHandler?.resetZoomTransform();
            this.queueRender();
        });
        this.resizeObserver.observe(this);
        this.canvas.addEventListener('wheel', event => event.preventDefault(), {
            passive: false
        });
        this.queueRender();
    }

    public override disconnectedCallback(): void {
        super.disconnectedCallback();
        this.canvas.removeEventListener('wheel', event => event.preventDefault());
        this.resizeObserver!.unobserve(this);
    }

    /**
     * @internal
     */
    public render(): void {
        this.renderQueued = false;
        this.renderer?.clearCanvas(
            this.canvas.width,
            this.canvas.height
        );
        this.dataManager = new DataManager(
            this.dies,
            this.quadrant,
            { width: this.canvas.width, height: this.canvas.height },
            this.colorScale,
            this.highlightedValues,
            this.colorScaleMode,
            this.dieLabelsHidden,
            this.dieLabelsSuffix,
            this.maxCharacters
        );

        this.renderer = new RenderingModule(this.dataManager, this.canvas);
        this.eventHandler = new EventHandler(
            this.canvas,
            this.zoomContainer,
            this.dataManager.containerDimensions,
            this.dataManager,
            { width: this.canvas.width, height: this.canvas.height },
            this.renderer,
            this.rect,
            this.quadrant
        );

        this.eventHandler.attachEvents(this);
        this.renderer.drawWafer();
    }

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

    private queueRender(): void {
        if (!this.$fastController.isConnected) {
            return;
        }
        if (!this.renderQueued) {
            this.renderQueued = true;
            DOM.queueUpdate(() => this.render());
        }
    }
}

const nimbleWaferMap = WaferMap.compose({
    baseName: 'wafer-map',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleWaferMap());
