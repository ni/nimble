// @ts-nocheck
import * as PIXI from 'pixi.js';
import {
    attr,
    DOM,
    nullableNumberConverter,
    observable
} from '@microsoft/fast-element';
import { Black, Black15, Black30, Black91, White } from '@ni/nimble-tokens/dist/styledictionary/js/tokens';
import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import { zoomIdentity, ZoomTransform } from 'd3-zoom';
import { Viewport } from 'pixi-viewport';
import { template } from './template';
import { styles } from './styles';
import { DataManager } from './modules/data-manager';
// import { RenderingModule } from './modules/rendering';
import { EventCoordinator } from './modules/event-coordinator';
import type { PointCoordinates } from '../types';
import {
    DieRenderInfo,
    HoverDieOpacity,
    WaferMapColorScale,
    WaferMapColorScaleMode,
    WaferMapDie,
    WaferMapOrientation,
    WaferMapQuadrant,
    WaferOutlineStyling
} from './types';
import type { PointCoordinates } from './types';
import { HoverHandler } from './modules/hover-handler';
import type { RenderingModule } from './modules/rendering';

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
    public renderer?: RenderingModule;
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

    /**
     * @internal
     */
    @observable public dieSprites?: PIXI.ParticleContainer;

    private pixiApp?: PIXI.Application<HTMLCanvasElement>;
    private eventCoordinator?: EventCoordinator;

    private readonly waferoutlineStyle: WaferOutlineStyling = {
        outlineColor: Black,
        outlineWidth: 3,
        outlineNative: false
    };

    public override connectedCallback(): void {
        super.connectedCallback();
        this.queueRender();
    }

    public override disconnectedCallback(): void {
        super.disconnectedCallback();
    }

    /**
     * @internal
     */
    public render(): void {
        this.initializeInternalModules();
        const cont = this.generateContainer();

        if (!this.pixiApp) {
            this.pixiApp = new PIXI.Application<HTMLCanvasElement>({ background: White });
            this.wafermapContainer.appendChild(this.pixiApp.view);
        }

        const waferPosition: PointCoordinates = { x: this.wafermapContainer.clientWidth / 2, y: this.wafermapContainer.clientHeight / 2 };
        const waferRadius = Math.min(waferPosition.x, waferPosition.y);

        this.drawWaferOutline(
            this.orientation,
            waferRadius - this.waferoutlineStyle.outlineWidth,
            waferPosition,
            this.waferoutlineStyle
        );

        const viewport = new Viewport({
            screenWidth: this.pixiApp.view.width,
            screenHeight: this.pixiApp.view.height,
            events: this.pixiApp.renderer.events,
            passiveWheel: false
        });
        this.pixiApp.stage.addChild(viewport);

        const pixiHoverDie = new PIXI.Sprite(PIXI.Texture.WHITE);
        pixiHoverDie.tint = 0x000000;
        pixiHoverDie.height = this.dataManager?.dieDimensions.width;
        pixiHoverDie.width = this.dataManager?.dieDimensions.height;
        pixiHoverDie.x = 0;
        pixiHoverDie.y = 0;
        pixiHoverDie.interactive = true;
        viewport.addEventListener('mousemove', e => {
            const dieCoordinates = this.calculateDieCoordinates({
                x: e.clientX,
                y: e.clientY
            });

            const position = this.dataManager!.getWaferMapDie(dieCoordinates);
            if (position) {
                pixiHoverDie.x = this.dataManager!.dieDimensions.height * position.x + this.dataManager?.margin.left;
                pixiHoverDie.y = this.dataManager!.dieDimensions.width * position.y + this.dataManager?.margin.left;
            }
        });
        viewport
            .drag()
            .wheel();
        viewport.clampZoom({ maxWidth: this.pixiApp.view.width, maxHeight: this.pixiApp.view.height });
        viewport.addChild(cont);
        viewport.addChild(pixiHoverDie);
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

    private queueRenderHover(): void {
        if (!this.$fastController.isConnected) {
            return;
        }
        DOM.queueUpdate(() => this.renderer?.renderHover());
    }

    private initializeInternalModules(): void {
        this.eventCoordinator = new EventCoordinator(this);
        this.dataManager = new DataManager(this);
    }

    private drawWaferOutline(orientation: WaferMapOrientation, radius: number, center: PointCoordinates, style: WaferOutlineStyling): void {
        if (!this.pixiApp) {
            return;
        }

        const waferC1x = center.x; // pixel c1 center x position
        const waferC1y = center.y; // pixel c2 center y position
        let waferC2x = 0; // pixel c2 center x position
        let waferC2y = 0; // pixel c2 center y position

        let waferOrientationAngle = 0; // radians
        let notchStartAngle = 0; // radians
        let notchEndAngle = 0; // radians

        switch (orientation) {
            case 'top':
                waferOrientationAngle = 3 * Math.PI / 2;
                notchStartAngle = 0;
                waferC2x = waferC1x;
                waferC2y = waferC1y - radius;
                break;
            case 'bottom':
                waferOrientationAngle = Math.PI / 2;
                notchStartAngle = Math.PI;
                waferC2x = waferC1x;
                waferC2y = waferC1y + radius;
                break;
            case 'left':
                waferOrientationAngle = Math.PI;
                notchStartAngle = -Math.PI / 2;
                waferC2x = waferC1x - radius;
                waferC2y = waferC1y;
                break;
            case 'right':
                waferOrientationAngle = 0;
                notchStartAngle = Math.PI / 2;
                waferC2x = waferC1x + radius;
                waferC2y = waferC1y;
                break;
            default:
                waferOrientationAngle = 0;
                notchStartAngle = Math.PI / 2;
                waferC2x = waferC1x + radius;
                waferC2y = waferC1y;
        }

        // Set the wafermap outline
        const wafer = new PIXI.Graphics();
        const cropAngle = 0.12; // radians
        const waferStartAngle = waferOrientationAngle + cropAngle;
        const waferEndAngle = waferOrientationAngle - cropAngle;
        wafer.lineStyle(style.outlineWidth, style.outlineColor, 1, 1, style.outlineNative);
        wafer.arc(waferC1x, waferC1y, radius, waferStartAngle, waferEndAngle);

        // Set the wafermap notch
        const notch = new PIXI.Graphics();
        const notchDiameter = Math.sin(cropAngle * 2) * radius;
        const notchRadius = notchDiameter / 2;
        notchEndAngle = notchStartAngle + Math.PI;
        notch.lineStyle(style.outlineWidth, style.outlineColor, 1, 1, style.outlineNative);
        notch.arc(waferC2x, waferC2y, notchRadius, notchStartAngle, notchEndAngle);

        // Draw the components
        this.pixiApp.stage.addChild(wafer); // draw the wafermap outline
        this.pixiApp.stage.addChild(notch); // draw the wafermap notch
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
        this.queueRenderHover();
    }

    private generateContainer(): PIXI.Graphics {
        let dies: DieRenderInfo[];
        dies = this.dataManager?.diesRenderInfo!;
        const dimension = this.dataManager?.dieDimensions;

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const container = new PIXI.Graphics();
        const width = dimension?.height!;
        const height = dimension?.width!;
        for (const die of dies) {
            const waferDie = new PIXI.Point(die.x, die.y);
            container.beginFill(this.rgba2hex(die.fillStyle));
            container.drawRect(waferDie.x, waferDie.y, width, height);
            container.endFill();
        }

        return container;
    }

    private rgba2hex(orig) {
        let a;
        let isPercent;
        const rgb = orig.replace(/\s/g, '').match(/^rgba?\((\d+),(\d+),(\d+),?([^,\s)]+)?/i);
        const alpha = (rgb && rgb[4] || '').trim();
        let hex = rgb
            ? (rgb[1] | 1 << 8).toString(16).slice(1)
          + (rgb[2] | 1 << 8).toString(16).slice(1)
          + (rgb[3] | 1 << 8).toString(16).slice(1) : orig;

        if (alpha !== '') {
            a = alpha;
        } else {
            a = 0x000001;
        }
        // multiply before convert to HEX
        a = ((a * 255) | 1 << 8).toString(16).slice(1);
        hex += a;

        return hex;
    }

    private calculateDieCoordinates(
        mousePosition: PointCoordinates
    ): PointCoordinates {
        const axisLocation = this.quadrant;
        const xRoundFunction = axisLocation === WaferMapQuadrant.bottomLeft
            || axisLocation === WaferMapQuadrant.topLeft
            ? Math.floor
            : Math.ceil;
        const yRoundFunction = axisLocation === WaferMapQuadrant.topLeft
            || axisLocation === WaferMapQuadrant.topRight
            ? Math.floor
            : Math.ceil;
        // go to x and y scale to get the x,y values of the die.
        const x = xRoundFunction(
            this.dataManager!.invertedHorizontalScale(
                mousePosition.x - this.dataManager!.margin.left
            )
        );
        const y = yRoundFunction(
            this.dataManager!.invertedVerticalScale(
                mousePosition.y - this.dataManager!.margin.top
            )
        );
        return { x, y };
    }
}

const nimbleWaferMap = WaferMap.compose({
    baseName: 'wafer-map',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleWaferMap());
export const waferMapTag = DesignSystem.tagFor(WaferMap);
