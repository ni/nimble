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

    /**
     * @internal
     */
    public readonly canvas!: HTMLCanvasElement;

    /**
     * @internal
     */
    @observable public canvasSideLength: number | undefined;

    @observable public colorScaleMode: WaferMapColorScaleMode = WaferMapColorScaleMode.linear;

    @observable public highlightedValues: string[] = [];
    @observable public dies: WaferMapDie[] = [];
    @observable public colorScale: WaferMapColorScale = {
        colors: [],
        values: []
    };

    private renderQueued = false;
    private dataManager: DataManager | undefined;
    private renderer: RenderingModule | undefined;
    private resizeObserver: ResizeObserver | undefined;
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
        if (
            this.canvasSideLength === undefined
            || this.canvasSideLength === 0
        ) {
            return;
        }
        this.renderer?.clearCanvas(
            this.canvasSideLength,
            this.canvasSideLength
        );
        this.dataManager = new DataManager(
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
        this.renderer = new RenderingModule(this.dataManager, this.canvas);
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
}

const nimbleWaferMap = WaferMap.compose({
    baseName: 'wafer-map',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleWaferMap());
