import {
    attr,
    DOM,
    nullableNumberConverter,
    observable
} from '@microsoft/fast-element';
import * as PIXI from 'pixi.js';
import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import { zoomIdentity, ZoomTransform } from 'd3-zoom';
import { template } from './template';
import { styles } from './styles';
import { DataManager } from './modules/data-manager';
// import { RenderingModule } from './modules/rendering';
// import { EventCoordinator } from './modules/event-coordinator';
import {
    DieRenderInfo,
    HoverDieOpacity,
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
    public canvasContext!: CanvasRenderingContext2D;

    /**
     * @internal
     */
    public readonly wafermapContainer!: HTMLElement;

    /**
     * @internal
     */
    public dataManager?: DataManager;

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

    private pixiApp?: PIXI.Application<HTMLCanvasElement>;

    public override connectedCallback(): void {
        super.connectedCallback();

        const initGraphics = new PIXI.Graphics();
        initGraphics.beginFill(0xDE3249);
        initGraphics.drawRect(50, 50, 100, 100);
        initGraphics.endFill();

        this.queueRender(initGraphics);
    }

    public override disconnectedCallback(): void {
        super.disconnectedCallback();
    }

    /**
     * @internal
     */
    public render(graphics: PIXI.Graphics): void {
        this.initializeInternalModules();
        const cont = this.generateParticleContainer();
        if (!this.pixiApp) {
            this.pixiApp = new PIXI.Application<HTMLCanvasElement>({ width: 640, height: 640, hello: true });
            this.wafermapContainer.appendChild(this.pixiApp.view);
        }
        this.pixiApp.stage.addChild(cont);
    }

    private queueRender(graphics: PIXI.Graphics): void {
        if (!this.$fastController.isConnected) {
            return;
        }
        if (!this.renderQueued) {
            this.renderQueued = true;
            DOM.queueUpdate(() => this.render(graphics));
        }
    }

    private initializeInternalModules(): void {
        this.dataManager = new DataManager(this);
    }

    private quadrantChanged(): void {
    }

    private orientationChanged(): void {
    }

    private maxCharactersChanged(): void {
    }

    private dieLabelsHiddenChanged(): void {
    }

    private dieLabelsSuffixChanged(): void {
    }

    private colorScaleModeChanged(): void {
    }

    private highlightedValuesChanged(): void {
    }

    private diesChanged(): void {
    }

    private colorScaleChanged(): void {
    }

    private transformChanged(): void {
    }

    private canvasWidthChanged(): void {
    }

    private canvasHeightChanged(): void {
    }

    private hoverDieChanged(): void {
        this.$emit('die-hover', { currentDie: this.hoverDie });
        // this.queueRenderHover();
    }

    private generateParticleContainer(): PIXI.ParticleContainer {
        let dies: DieRenderInfo[];
        dies = this.dataManager?.diesRenderInfo as DieRenderInfo[];
        const dimension = this.dataManager?.dieDimensions;

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const container = new PIXI.ParticleContainer(
            1000000,
            {
                vertices: true,
                scale: true,
                position: true,
                rotation: true,
                uvs: true,
                alpha: true,
            }
        );

        for (let die of dies) {
            const waferDie = new PIXI.Sprite(PIXI.Texture.WHITE);
            waferDie.tint = 0xDE3249;
            waferDie.height = dimension?.height as number;
            waferDie.width = dimension?.width as number;
            waferDie.position.x = die.x;
            waferDie.position.y = die.y;
            container.addChild(waferDie);
        }

        return container;
    }
}

const nimbleWaferMap = WaferMap.compose({
    baseName: 'wafer-map',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleWaferMap());
export const waferMapTag = DesignSystem.tagFor(WaferMap);
