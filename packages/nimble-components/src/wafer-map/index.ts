// @ts-nocheck
import * as PIXI from 'pixi.js';
import {
    attr,
    DOM,
    nullableNumberConverter,
    observable
} from '@microsoft/fast-element';
import { Black, RgbNiGreen, White } from '@ni/nimble-tokens/dist/styledictionary/js/tokens';
import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import { zoomIdentity, ZoomTransform } from 'd3-zoom';
import { Viewport } from 'pixi-viewport';
import { template } from './template';
import { styles } from './styles';
import { DataManager } from './modules/data-manager';
import {
    DieRenderInfo,
    DieStyling,
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
    private pixiHoverDie?: PIXI.Sprite;

    private readonly waferoutlineStyle: WaferOutlineStyling = {
        outlineColor: Black,
        outlineWidth: 3,
        outlineNative: false
    };

    private readonly dieStyle: DieStyling = {
        fillColor: RgbNiGreen,
        outlineColor: White,
        outlineWidth: 5,
        opacity: 1
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
                events: this.pixiApp.renderer.events,
                passiveWheel: false
            }).drag().wheel();
        }
        this.viewPort.clampZoom({ maxWidth: this.pixiApp.view.width, maxHeight: this.pixiApp.view.height });
        this.viewPort?.addEventListener('wheel', e => {
            e.preventDefault();
            const dieCoordinates = this.calculateDieCoordinates({
                x: e.globalX,
                y: e.globalY
            });
            this.setHoverPosition(dieCoordinates);
            this.renderVisibleText();
        });

        const waferPosition: PointCoordinates = { x: this.wafermapContainer.clientWidth / 2, y: this.wafermapContainer.clientHeight / 2 };
        const waferRadius = Math.min(waferPosition.x, waferPosition.y);

        this.drawWaferOutline(
            this.orientation,
            waferRadius - this.waferoutlineStyle.outlineWidth,
            waferPosition,
            this.waferoutlineStyle
        );

        this.drawDies(this.dataManager.diesRenderInfo, this.dataManager.dieDimensions, this.dieStyle);

        this.initHoverDie();

        this.renderVisibleText();

        this.pixiApp.stage.addChild(this.viewPort);

        this.viewPort.addEventListener('mousemove', e => {
            const dieCoordinates = this.calculateDieCoordinates({
                x: e.globalX,
                y: e.globalY
            });

            this.setHoverPosition(dieCoordinates);
        });
        this.viewPort.addEventListener('mouseup', e => {
            this.renderVisibleText(e);
        });
        this.viewPort.addEventListener('mouseenter', e => {
            this.renderVisibleText(e);
        });
        this.viewPort.addEventListener('mouseleave', e => {
            this.renderVisibleText(e);
        });
    }

    private setHoverPosition(dieCoordinates: PointCoordinates): void {
        if (!this.dataManager) {
            return;
        }
        const position = this.dataManager.getWaferMapDie(dieCoordinates);
        if (position) {
            this.pixiHoverDie.x = this.dataManager.dieDimensions.height * position.x + this.dataManager.margin.right;
            this.pixiHoverDie.y = this.dataManager.dieDimensions.width * position.y + this.dataManager.margin.bottom;
            this.pixiHoverDie.visible = true;
        }
    }

    private renderVisibleText(): void {
        const xFactor = this.viewPort?.transform.localTransform.a ?? 0;

        const yFactor = this.viewPort?.transform.localTransform.d ?? 0;

        const centerX = this.viewPort?.width / 2 / xFactor;

        const centerY = this.viewPort?.height / 2 / yFactor;

        const currentDieSize = (this.dataManager?.dieDimensions?.width ?? 0) * (xFactor ?? 0);

        if (currentDieSize > 30) {
            this.viewPort?.removeChild(this.numbersContainer!);

            let visibleDies = this.getVisibleDies(centerX, centerY, currentDieSize, xFactor, yFactor);

            this.numbersContainer = new PIXI.Graphics();

            const dieDimensions = this.dataManager?.dieDimensions;

            const fontSize = (dieDimensions?.height ?? 0) / 2;

            const textX = (dieDimensions?.width ?? 0) / 8;

            const textY = (dieDimensions?.height ?? 0) / 4;

            for (const die of visibleDies!) {
                const text = new PIXI.BitmapText(die.text, {
                    fontName: 'DieFont'
                });
                text.x = die.x + textX;
                text.y = die.y + textY;
                text.fontSize = fontSize;
                this.numbersContainer?.addChild(text);
            }
            this.viewPort?.addChild(this.numbersContainer!);
        } else {
            this.viewPort?.removeChild(this.numbersContainer!);
        }
    }

    private getVisibleDies(mouseX: number, mouseY: number, currentDieSize: number, xFactor: number, yFactor: number): DieRenderInfo[] {
        let visibleSquares: DieRenderInfo [] = [];
        if (!this.dataManager || !this.pixiApp) {
            return visibleSquares;
        }
        const relativeMouseX = mouseX - (this.viewPort?.x ?? 0);
        const relativeMouseY = mouseY - (this.viewPort?.y ?? 0);
        const adjustedMouseX = relativeMouseX / xFactor;
        const adjustedMouseY = relativeMouseY / yFactor;
        const dieHeight = (this.dataManager.dieDimensions?.width ?? 0);
        const dieWidth = (this.dataManager.dieDimensions?.width ?? 0);
        const viewPortWidth = this.pixiApp.renderer.view.width ?? 0;
        const viewPortHeight = this.pixiApp.renderer.view.height ?? 0;
        const horizontalDieCount = Math.ceil(viewPortWidth / currentDieSize) / 2;
        const verticalDieCount = Math.ceil(viewPortHeight / currentDieSize) / 2;
        visibleSquares = this.dataManager.diesRenderInfo.filter((die: WaferMapDie) => {
            const dieX = die.x;
            const dieY = die.y;
            const isDieVisible = dieX < adjustedMouseX + horizontalDieCount * dieWidth && dieX + dieWidth > adjustedMouseX - horizontalDieCount * dieWidth && dieY < adjustedMouseY + verticalDieCount * dieHeight && dieY + dieHeight > adjustedMouseY - verticalDieCount * dieHeight;
            return isDieVisible;
        });
        return visibleSquares;
    }

    private initHoverDie(): void {
        this.pixiHoverDie = new PIXI.Sprite(PIXI.Texture.WHITE);
        this.pixiHoverDie.tint = 0x000000;
        this.pixiHoverDie.height = this.dataManager?.dieDimensions.width;
        this.pixiHoverDie.width = this.dataManager?.dieDimensions.height;
        this.pixiHoverDie.x = 0;
        this.pixiHoverDie.y = 0;
        this.pixiHoverDie.interactive = true;
        this.pixiHoverDie.visible = false;

        this.viewPort.addChild(this.pixiHoverDie);
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
        this.generateFont();
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

    private drawDies(dies: DieRenderInfo[], dieDimensions: Dimensions, style: DieStyling): void {
        if (!this.dataManager || !this.viewPort) {
            return;
        }

        const container = new PIXI.Graphics();
        const fontSize = dieDimensions.height / 2;
        const outlineSize = style.outlineWidth * dieDimensions.width / 100;
        const offsetX = dieDimensions.width / 10;
        const offsetY = dieDimensions.height / 4;
        const textArray: PIXI.BitmapText[] = [];
        for (const die of dies) {
            const waferDie = new PIXI.Point(die.x, die.y);

            const text = new PIXI.BitmapText(die.text, {
                fontName: 'DieFont',
                fontSize,
                align: 'left'
            });
            text.x = waferDie.x + offsetX;
            text.y = waferDie.y + offsetY;
            textArray.push(text);

            container.lineStyle(outlineSize, style.outlineColor, 1);
            container.beginFill(this.rgba2hex(die.fillStyle));
            container.drawRect(waferDie.x, waferDie.y, dieDimensions.width, dieDimensions.height);
            container.endFill();
        }
        this.viewPort.addChild(container);
    }

    private generateFont(): void {
        PIXI.BitmapFont.from(
            'DieFont',
            {
                fill: '#FFFFFF',
                padding: 0,
                dropShadowAlpha: 0,
                dropShadowDistance: 0
            }
        );
    }

    private rgba2hex(orig: string): string {
        let a;
        const rgb = orig.replace(/\s/g, '').match(/^rgba?\((\d+),(\d+),(\d+),?([^,\s)]+)?/i);
        const alpha = ((rgb && rgb[4]) || '').trim();
        let hex: string = rgb
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
        const dieCoordinates: PointCoordinates = { x: -1, y: -1 };
        if (!this.viewPort) {
            return dieCoordinates;
        }
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
        dieCoordinates.x = xRoundFunction(
            this.dataManager!.invertedHorizontalScale(
                (mousePosition.x - this.viewPort.transform.localTransform.tx) / this.viewPort.transform.localTransform.a - this.dataManager!.margin.left
            )
        );
        dieCoordinates.y = yRoundFunction(
            this.dataManager!.invertedVerticalScale(
                (mousePosition.y - this.viewPort.transform.localTransform.ty) / this.viewPort.transform.localTransform.d - this.dataManager!.margin.top
            )
        );
        return dieCoordinates;
    }
}

const nimbleWaferMap = WaferMap.compose({
    baseName: 'wafer-map',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleWaferMap());
export const waferMapTag = DesignSystem.tagFor(WaferMap);
