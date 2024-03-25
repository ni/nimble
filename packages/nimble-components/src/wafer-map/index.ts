import {
    attr,
    nullableNumberConverter,
    observable
} from '@microsoft/fast-element';
import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import { zoomIdentity, ZoomTransform } from 'd3-zoom';
import type { Table } from 'apache-arrow';
import { type Remote, transfer } from 'comlink';
import { template } from './template';
import { styles } from './styles';
import { DataManager } from './modules/data-manager';
import { DataManager as ExperimentalDataManager } from './modules/experimental/data-manager';
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
import { WorkerRenderer } from './modules/experimental/worker-renderer';
import { HoverHandler } from './modules/hover-handler';
import { HoverHandler as ExperimentalHoverHandler } from './modules/experimental/hover-handler';
import { ZoomHandler } from './modules/zoom-handler';
import type { MatrixRenderer } from '../../build/generate-workers/dist/esm/source/matrix-renderer';
import { createMatrixRenderer } from './modules/create-matrix-renderer';
import type { WaferMapMatrix } from '../../build/generate-workers/dist/esm/source/types';

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
    public readonly waferMapUpdateTracker: WaferMapUpdateTracker = new WaferMapUpdateTracker(this as WaferMap);

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
    public worker!: Remote<MatrixRenderer>;

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
    public readonly stableDataManager: DataManager = new DataManager(
        this as WaferMap
    );

    /**
     * @internal
     */
    public readonly experimentalDataManager: ExperimentalDataManager = new ExperimentalDataManager(this as WaferMap);

    /**
     * @internal
     */
    public dataManager: DataManager | ExperimentalDataManager = this.stableDataManager;

    /**
     * @internal
     */
    public readonly mainRenderer: RenderingModule = new RenderingModule(
        this as WaferMap
    );

    /**
     * @internal
     */
    public readonly workerRenderer: WorkerRenderer = new WorkerRenderer(
        this as WaferMap
    );

    @observable
    public renderer: RenderingModule | WorkerRenderer = this.mainRenderer;

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
        this as WaferMap
    );

    private readonly experimentalHoverHandler: ExperimentalHoverHandler = new ExperimentalHoverHandler(this as WaferMap);

    private readonly zoomHandler: ZoomHandler = new ZoomHandler(
        this as WaferMap
    );

    private readonly resizeObserver = this.createResizeObserver();
    private readonly waferMapValidator: WaferMapValidator = new WaferMapValidator(this as WaferMap);

    public get validity(): WaferMapValidity {
        return this.waferMapValidator.getValidity();
    }

    public override async connectedCallback(): Promise<void> {
        super.connectedCallback();
        this.hoverHandler.connect();
        this.experimentalHoverHandler.connect();
        this.zoomHandler.connect();
        const { matrixRenderer } = await createMatrixRenderer();
        this.worker = matrixRenderer;
        if (this.diesTable !== undefined) {
            const offscreenOne = this.canvas.transferControlToOffscreen();
            await this.worker.setCanvas(
                transfer(offscreenOne, [
                    offscreenOne as unknown as Transferable
                ])
            );
        } else {
            this.canvasContext = this.canvas.getContext('2d', {
                willReadFrequently: true
            })!;
        }
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
     * Update function called when an update is queued.
     * It will check which updates are needed based on which properties have changed.
     * Each update represents a different starting point of the same sequential update flow.
     * The updates snowball one after the other, this function only choses the 'altitude'.
     * The hover does not require an event update, but it's also the last update in the sequence.
     */
    public async update(): Promise<void> {
        this.validate();
        if (this.validity.invalidDiesTableSchema) {
            return;
        }
        this.renderer = this.isExperimentalRenderer()
            ? this.workerRenderer
            : this.mainRenderer;
        // zoom translateExtent needs to be recalculated when canvas size changes
        this.dataManager = this.isExperimentalRenderer()
            ? this.experimentalDataManager
            : this.stableDataManager;
        if (this.waferMapUpdateTracker.requiresContainerDimensionsUpdate) {
            this.zoomHandler.disconnect();
            this.dataManager.updateContainerDimensions();
            this.renderer.updateSortedDiesAndDrawWafer();
            await this.drawWafer();
            this.zoomHandler.connect();
        } else if (this.waferMapUpdateTracker.requiresScalesUpdate) {
            this.dataManager.updateScales();
            this.renderer.updateSortedDiesAndDrawWafer();
        } else if (this.waferMapUpdateTracker.requiresLabelsFontSizeUpdate) {
            this.dataManager.updateLabelsFontSize();
            this.renderer.updateSortedDiesAndDrawWafer();
        } else if (this.waferMapUpdateTracker.requiresDiesRenderInfoUpdate) {
            this.dataManager.updateDiesRenderInfo();
            this.renderer.updateSortedDiesAndDrawWafer();
        } else if (this.waferMapUpdateTracker.requiresDrawnWaferUpdate) {
            await this.renderer.drawWafer();
        } else if (this.waferMapUpdateTracker.requiresRenderHoverUpdate) {
            this.renderer.renderHover();
        }
    }

    /**
     * @internal
     */
    public isExperimentalRenderer(): boolean {
        return this.diesTable !== undefined;
    }

    private async drawWafer(): Promise<void> {
        if (this.diesTable === undefined) {
            return;
        }
        const waferMapMatrix = {
            colIndexes: this.diesTable
                .getChild('colIndex')
                ?.toArray() as unknown as number[],
            rowIndexes: this.diesTable
                .getChild('rowIndex')
                ?.toArray() as unknown as number[],
            values: this.diesTable
                .getChild('value')
                ?.toArray() as unknown as number[]
        } as WaferMapMatrix;
        await this.worker.updateMatrix(waferMapMatrix);
        await this.setupWorker();
        await this.worker.drawWafer();
    }

    private async setupWorker(): Promise<void> {
        await this.worker.setDiesDimensions(this.dataManager.dieDimensions);

        const scaleX = this.dataManager.horizontalScale(1)!
            - this.dataManager.horizontalScale(0)!;
        const scaleY = this.dataManager.verticalScale(1)!
            - this.dataManager.verticalScale(0)!;
        await this.worker.setScaling(scaleX, scaleY);

        await this.worker.setBases(
            this.dataManager.horizontalScale(0)!,
            this.dataManager.verticalScale(0)!
        );
        await this.worker.setMargin(this.dataManager.margin);

        const topLeftCanvasCorner = this.transform.invert([0, 0]);
        const bottomRightCanvasCorner = this.transform.invert([
            this.canvas.width,
            this.canvas.height
        ]);
        await this.worker.setCanvasCorners(
            {
                x: topLeftCanvasCorner[0],
                y: topLeftCanvasCorner[1]
            },
            {
                x: bottomRightCanvasCorner[0],
                y: bottomRightCanvasCorner[1]
            }
        );
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
            this.canvasWidth = width;
            this.canvasHeight = height;
            this.worker.setCanvasDimensions({ width, height }).then(
                () => {},
                () => {}
            );
            if (this.diesTable === undefined) {
                this.canvas.width = width;
                this.canvas.height = height;
            }
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
}

const nimbleWaferMap = WaferMap.compose({
    baseName: 'wafer-map',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleWaferMap());
export const waferMapTag = 'nimble-wafer-map';
