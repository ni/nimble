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
// import { EventCoordinator } from './modules/event-coordinator';
import {
    DieRenderInfo,
    Dimensions,
    HoverDieOpacity,
    WaferMapColorScale,
    WaferMapColorScaleMode,
    WaferMapDie,
    WaferMapOrientation,
    WaferMapQuadrant,
    WaferOutlineStyling
} from './types';
import type { PointCoordinates } from './types';

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

    /**
     * @internal
     */
    @observable public dieSprites?: PIXI.ParticleContainer;

    private pixiApp?: PIXI.Application<HTMLCanvasElement>;
    private viewPort?: Viewport;

    private readonly waferoutlineStyle: WaferOutlineStyling = {
        outlineColor: Black,
        outlineWidth: 3,
        outlineNative: false
    };

    public override connectedCallback(): void {
        super.connectedCallback();
        this.initializeInternalModules();
        this.queueRender();
    }

    public override disconnectedCallback(): void {
        super.disconnectedCallback();
    }

    /**
     * @internal
     */
    public render(): void {
        if (!this.dataManager) {
            return;
        }

        if (!this.pixiApp) {
            this.pixiApp = new PIXI.Application<HTMLCanvasElement>({ background: White });
            this.wafermapContainer.appendChild(this.pixiApp.view);
        }

        if (!this.viewPort) {
            this.viewPort = new Viewport({
                screenWidth: this.pixiApp.view.width,
                screenHeight: this.pixiApp.view.height,
                events: this.pixiApp.renderer.events
            }).drag().wheel();
        }

        const waferPosition: PointCoordinates = { x: this.wafermapContainer.clientWidth / 2, y: this.wafermapContainer.clientHeight / 2 };
        const waferRadius = Math.min(waferPosition.x, waferPosition.y);

        this.drawWaferOutline(
            this.orientation,
            waferRadius - this.waferoutlineStyle.outlineWidth,
            waferPosition,
            this.waferoutlineStyle
        );

        this.drawDies(this.dataManager.diesRenderInfo, this.dataManager.dieDimensions);

        this.pixiApp.stage.addChild(this.viewPort);
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
        this.dataManager = new DataManager(this);
    }

    private drawWaferOutline(orientation: WaferMapOrientation, radius: number, center: PointCoordinates, style: WaferOutlineStyling): void {
        if (!this.viewPort) {
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
        const cropAngle = 0.05; // radians
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
        this.viewPort?.addChild(wafer); // draw the wafermap outline
        this.viewPort?.addChild(notch); // draw the wafermap notch
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

    private drawDies(dies: DieRenderInfo[], dieDimensions: Dimensions): void {
        if (!this.dataManager || !this.viewPort) {
            return;
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const container = new PIXI.Graphics();
        for (const die of dies) {
            const waferDie = new PIXI.Point(die.x, die.y);

            container.lineStyle(5, White, 1);
            container.beginFill(0xff0022);
            container.drawRect(waferDie.x, waferDie.y, dieDimensions.width, dieDimensions.height);
            container.endFill();
        }
        this.viewPort.addChild(container);
    }

    private generateText(): PIXI.Text[] {
        const labels: PIXI.Text[] = [];
        let dies: DieRenderInfo[];
        dies = this.dataManager?.diesRenderInfo!;
        const labelFontSize = this.dataManager?.labelsFontSize;
        const dimension = this.dataManager?.dieDimensions;

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        for (const die of dies) {
            const text = new PIXI.Text(die.text);
            text.style = new PIXI.TextStyle({
                fill: 0xFFFFFF,
                fontSize: labelFontSize
            });
            text.x = die.x;
            text.y = die.y;
            labels.push(text);
        }

        return labels;
    }
}

const nimbleWaferMap = WaferMap.compose({
    baseName: 'wafer-map',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleWaferMap());
export const waferMapTag = DesignSystem.tagFor(WaferMap);
