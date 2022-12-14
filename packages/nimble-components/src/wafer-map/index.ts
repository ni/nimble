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

    @observable public colorScaleMode: WaferMapColorScaleMode = WaferMapColorScaleMode.linear;

    @observable public highlightedValues: string[] = [];
    @observable public dies: WaferMapDie[] = [];
    @observable public colorScale: WaferMapColorScale = {
        colors: [],
        values: []
    };

    @observable private observedWidth = this.offsetWidth;
    @observable private observedHeight = this.offsetHeight;

    private renderQueued = false;
    private dataManager: DataManager | undefined;
    private resizeObserver: ResizeObserver | undefined;
    public override connectedCallback(): void {
        super.connectedCallback();
        this.resizeObserver = new ResizeObserver(entries => {
            const entry = entries[0];
            if (entry === undefined) return;
            const { height, width } = entry.contentRect;
            console.log(width, height);
            this.observedWidth = width;
            this.observedHeight = height;
        });
        this.resizeObserver.observe(this);
        this.queueRender();
    }

    public override disconnectedCallback(): void {
        this.resizeObserver?.unobserve(this);
    }

    /**
     * @internal
     */
    public render(): void {
        this.renderQueued = false;
        console.log('render', this.observedHeight, this.observedWidth);
        this.dataManager = new DataManager(
            this.dies,
            this.quadrant,
            { width: this.observedWidth, height: this.observedHeight },
            this.colorScale,
            this.highlightedValues,
            this.colorScaleMode,
            this.dieLabelsHidden,
            this.dieLabelsSuffix,
            this.maxCharacters
        );

        const renderer = new RenderingModule(this.dataManager, this.canvas);
        renderer.drawWafer();
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

    private observedWidthChanged(): void {
        debugger;
        console.log('width', this.observedWidth);
        this.queueRender();
    }

    private observedHeightChanged(): void {
        console.log('height', this.observedHeight);
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
