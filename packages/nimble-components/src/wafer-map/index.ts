import {
    attr,
    nullableNumberConverter,
    observable
} from '@microsoft/fast-element';
import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import { zoomIdentity, ZoomTransform } from 'd3-zoom';
import type { Table } from 'apache-arrow';
import { template } from './template';
import { styles } from './styles';
import { DataManager } from './modules/data-manager';
import { RenderingModule } from './modules/rendering';
import {
    HoverDie,
    HoverDieOpacity,
    WaferMapColorScale,
    WaferMapColorScaleMode,
    WaferMapDie,
    WaferMapOrientation,
    WaferMapOriginLocation,
    WaferMapValidity,
    type WaferRequiredFields
} from './types';
import { WaferMapUpdateTracker } from './modules/wafer-map-update-tracker';
import { WaferMapValidator } from './modules/wafer-map-validator';
import { WorkerRenderer } from './experimental/worker-renderer';
import { HoverHandler } from './modules/hover-handler';
import { HoverHandler as ExperimentalHoverHandler } from './experimental/hover-handler';
import { ZoomHandler } from './modules/zoom-handler';
import { Computations } from './experimental/computations';
import type { Dimensions, RenderConfig } from './workers/types';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-wafer-map': WaferMap;
    }
}

/**
 * A nimble-styled WaferMap
 */
export class WaferMap<
    T extends WaferRequiredFields = WaferRequiredFields
> extends FoundationElement {
    /**
     * @internal
     * needs to be initialized before the properties trigger changes
     */
    public readonly waferMapUpdateTracker: WaferMapUpdateTracker = new WaferMapUpdateTracker(this.asRequiredFieldsWaferMap);

    @attr({ attribute: 'origin-location' })
    public originLocation: WaferMapOriginLocation = WaferMapOriginLocation.bottomLeft;

    @attr({ attribute: 'grid-min-x', converter: nullableNumberConverter })
    public gridMinX?: number = undefined;

    @attr({ attribute: 'grid-max-x', converter: nullableNumberConverter })
    public gridMaxX?: number = undefined;

    @attr({ attribute: 'grid-min-y', converter: nullableNumberConverter })
    public gridMinY?: number = undefined;

    @attr({ attribute: 'grid-max-y', converter: nullableNumberConverter })
    public gridMaxY?: number = undefined;

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
    public currentTask: Promise<void> | undefined;

    /**
     * @internal
     */
    public workerCanvas!: HTMLCanvasElement;

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

    public readonly computations: Computations = new Computations(
        this.asRequiredFieldsWaferMap
    );

    public dataManager: DataManager = new DataManager(
        this.asRequiredFieldsWaferMap
    );

    public readonly workerRenderer = new WorkerRenderer(
        this.asRequiredFieldsWaferMap
    );

    @observable
    public renderer: RenderingModule = new RenderingModule(
            this.asRequiredFieldsWaferMap
        );

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
    @observable public hoverDie: WaferMapDie | HoverDie | undefined;

    @observable public highlightedTags: string[] = [];
    @observable public dies: WaferMapDie[] = [];
    @observable public diesTable: Table<T> | undefined;

    @observable public colorScale: WaferMapColorScale = {
        colors: [],
        values: []
    };

    private readonly hoverHandler: HoverHandler = new HoverHandler(
        this.asRequiredFieldsWaferMap
    );

    private readonly experimentalHoverHandler: ExperimentalHoverHandler = new ExperimentalHoverHandler(this.asRequiredFieldsWaferMap);

    private readonly zoomHandler: ZoomHandler = new ZoomHandler(
        this.asRequiredFieldsWaferMap
    );

    private readonly resizeObserver = this.createResizeObserver();
    private readonly waferMapValidator: WaferMapValidator = new WaferMapValidator(this.asRequiredFieldsWaferMap);

    public get validity(): WaferMapValidity {
        return this.waferMapValidator.getValidity();
    }

    public override connectedCallback(): void {
        super.connectedCallback();
        this.canvasContext = this.canvas.getContext('2d', {
            willReadFrequently: true
        })!;
        this.hoverHandler.connect();
        this.experimentalHoverHandler.connect();
        this.zoomHandler.connect();
        this.resizeObserver.observe(this);
        this.waferMapUpdateTracker.trackAll();
    }

    public override disconnectedCallback(): void {
        super.disconnectedCallback();
        this.hoverHandler.disconnect();
        this.experimentalHoverHandler.disconnect();
        this.zoomHandler.disconnect();
        this.resizeObserver.unobserve(this);
    }

    /**
     * @internal
     * Experimental update function called when an update is queued.
     */
    public async experimentalUpdate(): Promise<void> {
        if (this.validity.invalidDiesTableSchema) {
            return;
        }
        if (this.waferMapUpdateTracker.requiresEventsUpdate) {
            let setupWafer = false;
            if (this.waferMapUpdateTracker.requiresContainerDimensionsUpdate) {
                this.computations.componentResizeUpdate();
                setupWafer = true;
            } else if (this.waferMapUpdateTracker.requiresScalesUpdate) {
                this.computations.inputDataUpdate();
                setupWafer = true;
            } else if (
                this.waferMapUpdateTracker.requiresLabelsFontSizeUpdate
                || this.waferMapUpdateTracker.requiresDiesRenderInfoUpdate
            ) {
                this.computations.colorAndTextUpdate();
                setupWafer = true;
            }
            const snapshot = this.createSnapshot();
            if (setupWafer) {
                await this.workerRenderer.setupWafer(snapshot);
            }
            await this.workerRenderer.drawWafer(snapshot);
        }
        this.workerRenderer.renderHover();
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
        this.validate();
        if (this.isExperimentalUpdate()) {
            this.currentTask = this.experimentalUpdate();
            return;
        }
        if (this.waferMapUpdateTracker.requiresEventsUpdate) {
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
        } else if (this.waferMapUpdateTracker.requiresRenderHoverUpdate) {
            this.renderer.renderHover();
        }
    }

    /**
     * @internal
     */
    public isExperimentalUpdate(): boolean {
        return this.diesTable !== undefined;
    }

    private createSnapshot(): {
        canvasDimensions: Dimensions,
        renderConfig: RenderConfig,
        dieDimensions: Dimensions,
        transform: ZoomTransform,
        dieLabelsHidden: boolean,
        columnIndices: Int32Array,
        rowIndices: Int32Array,
        values: Float64Array
    } {
        const canvasDimensions = {
            width: this.canvasWidth ?? 0,
            height: this.canvasHeight ?? 0
        };
        const renderConfig: RenderConfig = {
            dieDimensions: this.computations.dieDimensions,
            margin: this.computations.margin,
            verticalCoefficient: this.computations.verticalCoefficient,
            horizontalCoefficient: this.computations.horizontalCoefficient,
            horizontalConstant: this.computations.horizontalConstant,
            verticalConstant: this.computations.verticalConstant,
            labelsFontSize: this.computations.labelsFontSize,
            colorScale: this.computations.colorScale,
            dieLabelsSuffix: this.dieLabelsSuffix,
            maxCharacters: this.maxCharacters
        };
        const dieDimensions = this.computations.dieDimensions;
        const transform = this.transform;
        const dieLabelsHidden = this.dieLabelsHidden;
        if (this.diesTable === undefined) {
            return {
                canvasDimensions,
                renderConfig,
                dieDimensions,
                transform,
                dieLabelsHidden,
                columnIndices: Int32Array.from([]),
                rowIndices: Int32Array.from([]),
                values: Float64Array.from([])
            };
        }
        const columnIndices = this.diesTable.getChild('colIndex')!.toArray();
        const rowIndices = this.diesTable.getChild('rowIndex')!.toArray();
        const values = this.diesTable.getChild('value')!.toArray();
        return {
            canvasDimensions,
            renderConfig,
            columnIndices,
            rowIndices,
            values,
            dieDimensions,
            transform,
            dieLabelsHidden
        };
    }

    private validate(): void {
        this.waferMapValidator.validateGridDimensions();
        this.waferMapValidator.validateDiesTableSchema();
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

    private gridMinXChanged(): void {
        this.waferMapUpdateTracker.track('gridMinX');
        this.waferMapUpdateTracker.queueUpdate();
    }

    private gridMaxXChanged(): void {
        this.waferMapUpdateTracker.track('gridMaxX');
        this.waferMapUpdateTracker.queueUpdate();
    }

    private gridMinYChanged(): void {
        this.waferMapUpdateTracker.track('gridMinY');
        this.waferMapUpdateTracker.queueUpdate();
    }

    private gridMaxYChanged(): void {
        this.waferMapUpdateTracker.track('gridMaxY');
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

    private highlightedTagsChanged(): void {
        this.waferMapUpdateTracker.track('highlightedTags');
        this.waferMapUpdateTracker.queueUpdate();
    }

    private diesChanged(): void {
        this.waferMapUpdateTracker.track('dies');
        this.waferMapUpdateTracker.queueUpdate();
    }

    private diesTableChanged(): void {
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

    private get asRequiredFieldsWaferMap(): WaferMap {
        return this as WaferMap;
    }
}

const nimbleWaferMap = WaferMap.compose({
    baseName: 'wafer-map',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleWaferMap());
export const waferMapTag = 'nimble-wafer-map';
