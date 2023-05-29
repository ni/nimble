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
// import { DataManager } from './modules/data-manager';
// import { RenderingModule } from './modules/rendering';
// import { EventCoordinator } from './modules/event-coordinator';
import {
    HoverDieOpacity,
    WaferMapColorScale,
    WaferMapColorScaleMode,
    WaferMapDie,
    WaferMapOrientation,
    WaferMapQuadrant
} from './types';
import { Black, White } from '@ni/nimble-tokens/dist/styledictionary/js/tokens';

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

    // /**
    //  * @internal
    //  */
    // public dataManager?: DataManager;

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

    /**
     * @internal
     */
    @observable public dieSprites?: PIXI.ParticleContainer;

    private pixiApp?: PIXI.Application<HTMLCanvasElement>;


    public override connectedCallback(): void {
        super.connectedCallback();

        this.dieSprites = new PIXI.ParticleContainer(10000, {
            scale: true,
            position: true,
            rotation: true,
            uvs: true,
            alpha: true,
        });

        const waferDie = new PIXI.Sprite(PIXI.Texture.WHITE);
        waferDie.tint = 0xDE3249;
        waferDie.height = 10;
        waferDie.width = 10;
        waferDie.position.x = 1;
        waferDie.position.y = 1;
        waferDie.interactive = true;
        waferDie.onmouseenter = (e: Event) => {console.log(e);}

        this.dieSprites.addChild(waferDie);

        if (this.dieSprites !== undefined) {
            this.queueRender(this.dieSprites);
        }
    }

    public override disconnectedCallback(): void {
        super.disconnectedCallback();
    }

    /**
     * @internal
     */
    public render(dieSprites: PIXI.ParticleContainer): void {
        if (!this.pixiApp) {
            this.pixiApp = new PIXI.Application<HTMLCanvasElement>({ width: 640, height: 640, hello: true, background: White });
            this.wafermapContainer.appendChild(this.pixiApp.view);
        }
        this.pixiApp.stage.addChild(dieSprites);

        const cx = 220;
        const cy = 250;
        const radius = 200;
        const cropAngle = 0.12; //radians
        const startAngle = 2 * Math.PI + cropAngle;
        const endAngle = 2 * Math.PI - cropAngle;
        const notchDiameter = Math.sin(cropAngle * 2) * radius;
        const notchRadius = notchDiameter / 2;

        const arc = new PIXI.Graphics();
        arc.lineStyle(3, 0x3333DD, 1);
        arc.arc(cx, cy, radius, startAngle, endAngle);
        this.pixiApp.stage.addChild(arc);

        const c2x = cx + radius;
        const c2y = cy;
        const radius2 = notchRadius;
        const startAngle2 = Math.PI / 2;
        const endAngle2 = 3 * Math.PI / 2;

        const arc2 = new PIXI.Graphics();
        arc2.lineStyle(3, 0x3333DD, 1);
        arc2.arc(c2x, c2y, radius2, startAngle2, endAngle2);
        this.pixiApp.stage.addChild(arc2);
    }

    private queueRender(dieSprites: PIXI.ParticleContainer): void {
        if (!this.$fastController.isConnected) {
            return;
        }
        if (!this.renderQueued) {
            this.renderQueued = true;
            DOM.queueUpdate(() => this.render(dieSprites));
        }
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
}

const nimbleWaferMap = WaferMap.compose({
    baseName: 'wafer-map',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleWaferMap());
export const waferMapTag = DesignSystem.tagFor(WaferMap);
