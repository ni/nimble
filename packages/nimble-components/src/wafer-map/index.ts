import {
    attr,
    DOM,
    nullableNumberConverter,
    observable
} from '@microsoft/fast-element';
import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import { template } from './template';
import { styles } from './styles';
import { DataManager } from './modules/data-manager';
import { RenderingModule } from './modules/rendering';
import { EventHandler } from './modules/event-handler';
import {
    WaferMapColorScale,
    WaferMapColorScaleMode,
    WaferMapDie,
    WaferMapOrientation,
    WaferMapQuadrant,
    HoverHandlerData
} from './types';
import type { ZoomHandlerData } from './modules/zoom-handler';
import type { EventHandlerData, EventCallbacks } from './modules/event-handler';

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

    // Last selectedDie accessor
    public get lastSelectedDie(): WaferMapDie | undefined {
        return this.eventHandler?.lastSelectedDie;
    }

    /**
     * @internal
     */
    @observable public canvasSideLength = 0;
    @observable public highlightedValues: string[] = [];
    @observable public dies: WaferMapDie[] = [];
    @observable public colorScale: WaferMapColorScale = {
        colors: [],
        values: []
    };

    private renderQueued = false;
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
            this.canvasSideLength = Math.min(height, width);
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
        if (
            this.canvasSideLength === undefined
            || this.canvasSideLength === 0
        ) {
            return;
        }
        this.clearCanvas(this.canvasSideLength, this.canvasSideLength);

        const dataManager = new DataManager(
            this.dies,
            this.quadrant,
            { width: this.canvasSideLength, height: this.canvasSideLength },
            this.colorScale,
            this.highlightedValues,
            this.colorScaleMode,
            this.dieLabelsHidden,
            this.dieLabelsSuffix,
            this.maxCharacters
        );

        const renderer = new RenderingModule(dataManager, this.canvas);
        this.eventHandler = new EventHandler(
            this.parseWaferDataToEventData(dataManager, renderer, this)
        );
        this.eventHandler.attachEvents(this);
        renderer.drawWafer();
    }

    private clearCanvas(width: number, height: number): void {
        const context = this.canvas.getContext('2d')!;
        context.clearRect(0, 0, width, height);
    }

    private readonly onDieSelected = (die: WaferMapDie): void => {
        this.dispatchEvent(
            new CustomEvent('die-selected', { detail: { die } })
        );
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

    private canvasSideLengthChanged(): void {
        if (
            this.canvasSideLength !== undefined
            && this.canvasSideLength !== 0
        ) {
            this.canvas.width = this.canvasSideLength;
            this.canvas.height = this.canvasSideLength;
        }
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

    private parseWaferDataToEventData(
        dataManager: DataManager,
        renderer: RenderingModule,
        wafermap: WaferMap
    ): EventHandlerData {
        const zoomHandlerData: ZoomHandlerData = {
            canvas: wafermap.canvas,
            zoomContainer: wafermap.zoomContainer,
            containerDimensions: dataManager.containerDimensions,
            canvasLength: wafermap.canvasSideLength,
            renderModule: renderer
        };

        const hoverHandlerData: HoverHandlerData = {
            canvas: wafermap.canvas,
            rect: wafermap.rect,
            dataManager,
            quadrant: wafermap.quadrant
        };

        const eventCallbacks: EventCallbacks = {
            dieSelected: this.onDieSelected
        };

        return { zoomHandlerData, hoverHandlerData, eventCallbacks };
    }
}

const nimbleWaferMap = WaferMap.compose({
    baseName: 'wafer-map',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleWaferMap());
