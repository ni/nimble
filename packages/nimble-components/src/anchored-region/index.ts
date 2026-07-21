import { attr, DOM, observable } from '@ni/fast-element';
import { Direction, eventResize, eventScroll } from '@ni/fast-web-utilities';
import {
    DesignSystem,
    AnchoredRegion as FoundationAnchoredRegion,
    FoundationElement,
    getDirection,
    anchoredRegionTemplate as template
} from '@ni/fast-foundation';
import { styles } from './styles';
import { IntersectionService } from './intersection-service';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-anchored-region': AnchoredRegion;
    }
}

// When the anchor element changes position on the page, it is the client's responsibility to update the position
// of the anchored region by calling update() on the anchored region.
//
// When the anchor element is recreated on the page, it is the client's responsibility to reset the reference the
// anchored region has to the anchor element. This can be done by either recreating the anchor element with a new
// ID that is also set as the \`anchor\` attribute on the anchored region or by explicitly setting the value of
// anchorElement on the anchored region to the new anchor element.

/**
 * Defines the base behavior of an anchored region on a particular axis
 *
 * @public
 */
export type AxisPositioningMode = 'uncontrolled' | 'locktodefault' | 'dynamic';

/**
 * Defines the scaling behavior of an anchored region on a particular axis
 *
 * @public
 */
export type AxisScalingMode = 'anchor' | 'fill' | 'content';

/**
 * Defines the horizontal positioning options for an anchored region
 *
 * @public
 */
export type HorizontalPosition = StartOrEnd | LeftOrRight | 'center' | 'unset';

type LeftOrRight = 'left' | 'right';
type StartOrEnd = 'start' | 'end';

/**
 * Defines the vertical positioning options for an anchored region
 *
 * @public
 */
export type VerticalPosition = TopOrBottom | 'center' | 'unset';

type TopOrBottom = 'top' | 'bottom';

type ConcretePosition = LeftOrRight | TopOrBottom;

/**
 * Defines if the component updates its position automatically. Calling update() always provokes an update.
 * anchor - the component only updates its position when the anchor resizes (default)
 * auto - the component updates its position when:
 * - update() is called
 * - the anchor resizes
 * - the window resizes
 * - the viewport resizes
 * - any scroll event in the document
 *
 * @public
 */
export type AutoUpdateMode = 'anchor' | 'auto';

/**
 * Describes the possible positions of the region relative
 * to its anchor. Depending on the axis start = left/top, end = right/bottom
 *
 * @public
 */
export type AnchoredRegionPositionLabel = VirtualPositionLabel | 'center';

type StartPositionLabel = 'start' | 'insetStart';
type EndPositionLabel = 'end' | 'insetEnd';
type VirtualPositionLabel = StartPositionLabel | EndPositionLabel;

/**
 * @internal
 */
interface Dimension {
    regionSize: number;
    anchorStart: number;
    anchorEnd: number;
    viewportStart: number;
    viewportEnd: number;
}

/**
 * A nimble-styled anchored region control.
 */
export class AnchoredRegion extends FoundationElement {
    private static readonly intersectionService: IntersectionService = new IntersectionService();

    /**
     * The HTML ID of the anchor element this region is positioned relative to
     *
     * @public
     * @remarks
     * HTML Attribute: anchor
     */
    @attr
    public anchor = '';

    /**
     * The HTML ID of the viewport element this region is positioned relative to
     *
     * @public
     * @remarks
     * HTML Attribute: anchor
     */
    @attr
    public viewport = '';

    /**
     * Sets what logic the component uses to determine horizontal placement.
     * 'locktodefault' forces the default position
     * 'dynamic' decides placement based on available space
     * 'uncontrolled' does not control placement on the horizontal axis
     *
     * @public
     * @remarks
     * HTML Attribute: horizontal-positioning-mode
     */
    @attr({ attribute: 'horizontal-positioning-mode' })
    public horizontalPositioningMode: AxisPositioningMode = 'uncontrolled';

    /**
     * The default horizontal position of the region relative to the anchor element
     *
     * @public
     * @remarks
     * HTML Attribute: horizontal-default-position
     */
    @attr({ attribute: 'horizontal-default-position' })
    public horizontalDefaultPosition: HorizontalPosition = 'unset';

    /**
     * Whether the region remains in the viewport (ie. detaches from the anchor) on the horizontal axis
     *
     * @public
     * @remarks
     * HTML Attribute: horizontal-viewport-lock
     */
    @attr({ attribute: 'horizontal-viewport-lock', mode: 'boolean' })
    public horizontalViewportLock = false;

    /**
     * Whether the region overlaps the anchor on the horizontal axis
     *
     * @public
     * @remarks
     * HTML Attribute: horizontal-inset
     */
    @attr({ attribute: 'horizontal-inset', mode: 'boolean' })
    public horizontalInset = false;

    /**
     * How narrow the space allocated to the default position has to be before the widest area
     * is selected for layout
     *
     * @public
     * @remarks
     * HTML Attribute: horizontal-threshold
     */
    @attr({ attribute: 'horizontal-threshold' })
    public horizontalThreshold?: number;

    /**
     * Defines how the width of the region is calculated
     *
     * @public
     * @remarks
     * HTML Attribute: horizontal-scaling
     */
    @attr({ attribute: 'horizontal-scaling' })
    public horizontalScaling: AxisScalingMode = 'content';

    /**
     * Sets what logic the component uses to determine vertical placement.
     * 'locktodefault' forces the default position
     * 'dynamic' decides placement based on available space
     * 'uncontrolled' does not control placement on the vertical axis
     *
     * @public
     * @remarks
     * HTML Attribute: vertical-positioning-mode
     */
    @attr({ attribute: 'vertical-positioning-mode' })
    public verticalPositioningMode: AxisPositioningMode = 'uncontrolled';

    /**
     * The default vertical position of the region relative to the anchor element
     *
     * @public
     * @remarks
     * HTML Attribute: vertical-default-position
     */
    @attr({ attribute: 'vertical-default-position' })
    public verticalDefaultPosition: VerticalPosition = 'unset';

    /**
     * Whether the region remains in the viewport (ie. detaches from the anchor) on the vertical axis
     *
     * @public
     * @remarks
     * HTML Attribute: vertical-viewport-lock
     */
    @attr({ attribute: 'vertical-viewport-lock', mode: 'boolean' })
    public verticalViewportLock = false;

    /**
     * Whether the region overlaps the anchor on the vertical axis
     *
     * @public
     * @remarks
     * HTML Attribute: vertical-inset
     */
    @attr({ attribute: 'vertical-inset', mode: 'boolean' })
    public verticalInset = false;

    /**
     * How short the space allocated to the default position has to be before the tallest area
     * is selected for layout
     *
     * @public
     * @remarks
     * HTML Attribute: vertical-threshold
     */
    @attr({ attribute: 'vertical-threshold' })
    public verticalThreshold?: number;

    /**
     * Defines how the height of the region is calculated
     *
     * @public
     * @remarks
     * HTML Attribute: vertical-scaling
     */
    @attr({ attribute: 'vertical-scaling' })
    public verticalScaling: AxisScalingMode = 'content';

    /**
     * Whether the region is positioned using css "position: fixed".
     * Otherwise the region uses "position: absolute".
     * Fixed placement allows the region to break out of parent containers,
     *
     * @public
     * @remarks
     * HTML Attribute: fixed-placement
     */
    @attr({ attribute: 'fixed-placement', mode: 'boolean' })
    public fixedPlacement = false;

    /**
     * Defines what triggers the anchored region to revaluate positioning
     *
     * @public
     * @remarks
     * HTML Attribute: auto-update-mode
     */
    @attr({ attribute: 'auto-update-mode' })
    public autoUpdateMode: AutoUpdateMode = 'anchor';

    /**
     * The HTML element being used as the anchor
     *
     * @public
     */
    @observable
    public anchorElement: HTMLElement | null = null;

    /**
     * The HTML element being used as the viewport
     *
     * @public
     */
    @observable
    public viewportElement: HTMLElement | null = null;

    /**
     * indicates that an initial positioning pass on layout has completed
     *
     * @internal
     */
    @observable
    public initialLayoutComplete = false;

    /**
     * indicates the current horizontal position of the region
     */
    public verticalPosition: AnchoredRegionPositionLabel | undefined;

    /**
     * indicates the current vertical position of the region
     */
    public horizontalPosition: AnchoredRegionPositionLabel | undefined;

    /**
     * values to be applied to the component's transform on render
     */
    private translateX = 0;
    private translateY = 0;

    /**
     * the span to be applied to the region on each axis
     */
    private regionWidth?: string;
    private regionHeight?: string;

    private resizeDetector: ResizeObserver | null = null;

    private viewportRect: DOMRect | undefined;
    private anchorRect: DOMRect | undefined;
    private regionRect: DOMRect | undefined;

    /**
     * base offsets between the positioner's base position and the anchor's
     */
    private baseHorizontalOffset = 0;
    private baseVerticalOffset = 0;

    private pendingPositioningUpdate = false;
    private pendingReset = false;
    private currentDirection: Direction = Direction.ltr;
    private regionVisible = false;

    // indicates that a layout update should occur even if geometry has not changed
    // used to ensure some attribute changes are applied
    private forceUpdate = false;

    // defines how big a difference in pixels there must be between states to
    // justify a layout update that affects the dom (prevents repeated sub-pixel corrections)
    private readonly updateThreshold = 0.5;

    /**
     * @internal
     */
    public override connectedCallback(): void {
        super.connectedCallback();
        if (this.autoUpdateMode === 'auto') {
            this.startAutoUpdateEventListeners();
        }
        this.initialize();
    }

    /**
     * @internal
     */
    public override disconnectedCallback(): void {
        super.disconnectedCallback();
        if (this.autoUpdateMode === 'auto') {
            this.stopAutoUpdateEventListeners();
        }
        this.stopObservers();
        this.disconnectResizeDetector();
    }

    /**
     * @internal
     */
    public adoptedCallback(): void {
        this.initialize();
    }

    /**
     * update position
     */
    public update = (): void => {
        if (!this.pendingPositioningUpdate) {
            this.requestPositionUpdates();
        }
    };

    /**
     * destroys the instance's resize observer
     */
    private disconnectResizeDetector(): void {
        if (this.resizeDetector !== null) {
            this.resizeDetector.disconnect();
            this.resizeDetector = null;
        }
    }

    /**
     * initializes the instance's resize observer
     */
    private initializeResizeDetector(): void {
        this.disconnectResizeDetector();
        this.resizeDetector = new ResizeObserver(this.handleResize);
    }

    /**
     * react to attribute changes that don't require a reset
     */
    private updateForAttributeChange(): void {
        if (this.$fastController.isConnected && this.initialLayoutComplete) {
            this.forceUpdate = true;
            this.update();
        }
    }

    /**
     * fully initializes the component
     */
    private initialize(): void {
        this.initializeResizeDetector();
        if (this.anchorElement === null) {
            this.anchorElement = this.getAnchor();
        }
        this.requestReset();
    }

    /**
     * Request a reset if there are currently no open requests
     */
    private requestReset(): void {
        if (this.$fastController.isConnected && !this.pendingReset) {
            this.setInitialState();
            DOM.queueUpdate(() => this.reset());
            this.pendingReset = true;
        }
    }

    /**
     * sets the starting configuration for component internal values
     */
    private setInitialState(): void {
        this.initialLayoutComplete = false;
        this.regionVisible = false;
        this.translateX = 0;
        this.translateY = 0;

        this.baseHorizontalOffset = 0;
        this.baseVerticalOffset = 0;

        this.viewportRect = undefined;
        this.regionRect = undefined;
        this.anchorRect = undefined;

        this.verticalPosition = undefined;
        this.horizontalPosition = undefined;

        this.style.opacity = '0';
        this.style.pointerEvents = 'none';

        this.forceUpdate = false;

        this.style.position = this.fixedPlacement ? 'fixed' : 'absolute';
        this.updatePositionClasses();

        this.updateRegionStyle();
    }

    /**
     * starts observers
     */
    private readonly startObservers = (): void => {
        this.stopObservers();

        if (this.anchorElement === null) {
            return;
        }

        this.requestPositionUpdates();

        if (this.resizeDetector !== null) {
            this.resizeDetector.observe(this.anchorElement);
            this.resizeDetector.observe(this);
        }
    };

    /**
     * get position updates
     */
    private readonly requestPositionUpdates = (): void => {
        if (this.anchorElement === null || this.pendingPositioningUpdate) {
            return;
        }
        AnchoredRegion.intersectionService.requestPosition(this, this.handleIntersection);
        AnchoredRegion.intersectionService.requestPosition(
            this.anchorElement,
            this.handleIntersection
        );
        if (this.viewportElement !== null) {
            AnchoredRegion.intersectionService.requestPosition(
                this.viewportElement,
                this.handleIntersection
            );
        }
        this.pendingPositioningUpdate = true;
    };

    /**
     * stops observers
     */
    private readonly stopObservers = (): void => {
        if (this.pendingPositioningUpdate) {
            this.pendingPositioningUpdate = false;
            AnchoredRegion.intersectionService.cancelRequestPosition(
                this,
                this.handleIntersection
            );
            if (this.anchorElement !== null) {
                AnchoredRegion.intersectionService.cancelRequestPosition(
                    this.anchorElement,
                    this.handleIntersection
                );
            }
            if (this.viewportElement !== null) {
                AnchoredRegion.intersectionService.cancelRequestPosition(
                    this.viewportElement,
                    this.handleIntersection
                );
            }
        }
        if (this.resizeDetector !== null) {
            this.resizeDetector.disconnect();
        }
    };

    /**
     * Gets the viewport element by id, or defaults to document root
     */
    private readonly getViewport = (): HTMLElement | null => {
        if (typeof this.viewport !== 'string' || this.viewport === '') {
            return document.documentElement;
        }

        return document.getElementById(this.viewport);
    };

    /**
     *  Gets the anchor element by id
     */
    private readonly getAnchor = (): HTMLElement | null => {
        return document.getElementById(this.anchor);
    };

    /**
     *  Handle intersections
     */
    private readonly handleIntersection = (entries: IntersectionObserverEntry[]): void => {
        if (!this.pendingPositioningUpdate) {
            return;
        }

        this.pendingPositioningUpdate = false;

        if (!this.applyIntersectionEntries(entries)) {
            return;
        }

        this.updateLayout();
    };

    /**
     *  iterate through intersection entries and apply data
     */
    private readonly applyIntersectionEntries = (
        entries: IntersectionObserverEntry[]
    ): boolean => {
        const regionEntry: IntersectionObserverEntry | undefined = entries.find(
            x => x.target === this
        );
        const anchorEntry: IntersectionObserverEntry | undefined = entries.find(
            x => x.target === this.anchorElement
        );
        const viewportEntry: IntersectionObserverEntry | undefined = entries.find(
            x => x.target === this.viewportElement
        );

        if (
            regionEntry === undefined
            || viewportEntry === undefined
            || anchorEntry === undefined
        ) {
            return false;
        }

        // don't update the dom unless there is a significant difference in rect positions
        if (
            !this.regionVisible
            || this.forceUpdate
            || this.regionRect === undefined
            || this.anchorRect === undefined
            || this.viewportRect === undefined
            || this.isRectDifferent(this.anchorRect, anchorEntry.boundingClientRect)
            || this.isRectDifferent(this.viewportRect, viewportEntry.boundingClientRect)
            || this.isRectDifferent(this.regionRect, regionEntry.boundingClientRect)
        ) {
            this.regionRect = regionEntry.boundingClientRect;
            this.anchorRect = anchorEntry.boundingClientRect;
            if (this.viewportElement === document.documentElement) {
                this.viewportRect = new DOMRectReadOnly(
                    viewportEntry.boundingClientRect.x
                        + document.documentElement.scrollLeft,
                    viewportEntry.boundingClientRect.y
                        + document.documentElement.scrollTop,
                    viewportEntry.boundingClientRect.width,
                    viewportEntry.boundingClientRect.height
                );
            } else {
                this.viewportRect = viewportEntry.boundingClientRect;
            }

            this.updateRegionOffset();

            this.forceUpdate = false;

            return true;
        }

        return false;
    };

    /**
     *  Update the offset values
     */
    private readonly updateRegionOffset = (): void => {
        if (this.anchorRect && this.regionRect) {
            this.baseHorizontalOffset = this.baseHorizontalOffset
                + (this.anchorRect.left - this.regionRect.left)
                + (this.translateX - this.baseHorizontalOffset);

            this.baseVerticalOffset = this.baseVerticalOffset
                + (this.anchorRect.top - this.regionRect.top)
                + (this.translateY - this.baseVerticalOffset);
        }
    };

    /**
     *  compare rects to see if there is enough change to justify a DOM update
     */
    private readonly isRectDifferent = (
        rectA: DOMRect | ClientRect,
        rectB: DOMRect | ClientRect
    ): boolean => {
        if (
            Math.abs(rectA.top - rectB.top) > this.updateThreshold
            || Math.abs(rectA.right - rectB.right) > this.updateThreshold
            || Math.abs(rectA.bottom - rectB.bottom) > this.updateThreshold
            || Math.abs(rectA.left - rectB.left) > this.updateThreshold
        ) {
            return true;
        }
        return false;
    };

    /**
     *  Handle resize events
     */
    private readonly handleResize = (): void => {
        this.update();
    };

    /**
     * resets the component
     */
    private readonly reset = (): void => {
        if (!this.pendingReset) {
            return;
        }

        this.pendingReset = false;
        if (this.anchorElement === null) {
            this.anchorElement = this.getAnchor();
        }

        if (this.viewportElement === null) {
            this.viewportElement = this.getViewport();
        }

        this.currentDirection = getDirection(this);
        this.startObservers();
    };

    /**
     *  Recalculate layout related state values
     */
    private readonly updateLayout = (): void => {
        if (this.horizontalPositioningMode !== 'uncontrolled'
            && (this.horizontalDefaultPosition === 'start' || this.horizontalDefaultPosition === 'end')
        ) {
            // if direction has changed we need to reset the layout
            const direction: Direction = getDirection(this);
            if (direction !== this.currentDirection) {
                this.currentDirection = direction;
                this.initialize();
                return;
            }
        }

        const horizontalDimension = {
            regionSize: this.regionRect?.width ?? 0,
            anchorStart: this.anchorRect?.left ?? 0,
            anchorEnd: this.anchorRect?.right ?? 0,
            viewportStart: this.viewportRect?.left ?? 0,
            viewportEnd: this.viewportRect?.right ?? 0
        };
        const verticalDimension = {
            regionSize: this.regionRect?.height ?? 0,
            anchorStart: this.anchorRect?.top ?? 0,
            anchorEnd: this.anchorRect?.bottom ?? 0,
            viewportStart: this.viewportRect?.top ?? 0,
            viewportEnd: this.viewportRect?.bottom ?? 0
        };

        const desiredHorizontalPosition: AnchoredRegionPositionLabel | undefined = this.getDesiredPosition(
            true,
            this.horizontalPositioningMode,
            this.horizontalInset,
            this.horizontalDefaultPosition,
            this.horizontalThreshold,
            horizontalDimension
        );
        const desiredVerticalPosition: AnchoredRegionPositionLabel | undefined = this.getDesiredPosition(
            false,
            this.verticalPositioningMode,
            this.verticalInset,
            this.verticalDefaultPosition,
            this.verticalThreshold,
            verticalDimension
        );

        const nextWidth = this.getDesiredSize(desiredHorizontalPosition, this.horizontalScaling, horizontalDimension);
        const nextHeight = this.getDesiredSize(desiredVerticalPosition, this.verticalScaling, verticalDimension);

        const positionChanged: boolean = this.horizontalPosition !== desiredHorizontalPosition
            || this.verticalPosition !== desiredVerticalPosition;

        if (this.regionRect !== undefined
            && this.anchorRect !== undefined
            && this.viewportRect !== undefined
        ) {
            if (desiredHorizontalPosition !== undefined) {
                const { regionSize, translation } = this.setDimensionPosition(
                    desiredHorizontalPosition,
                    nextWidth,
                    this.horizontalScaling,
                    this.horizontalViewportLock,
                    this.baseHorizontalOffset,
                    horizontalDimension
                );
                this.regionWidth = regionSize;
                this.translateX = translation;
                this.horizontalPosition = desiredHorizontalPosition;
            }
            if (desiredVerticalPosition !== undefined) {
                const { regionSize, translation } = this.setDimensionPosition(
                    desiredVerticalPosition,
                    nextHeight,
                    this.verticalScaling,
                    this.verticalViewportLock,
                    this.baseVerticalOffset,
                    verticalDimension,
                );
                this.regionHeight = regionSize;
                this.translateY = translation;
                this.verticalPosition = desiredVerticalPosition;
            }
        }

        this.updateRegionStyle();

        if (!this.initialLayoutComplete) {
            this.initialLayoutComplete = true;
            this.requestPositionUpdates();
            return;
        }

        if (!this.regionVisible) {
            this.regionVisible = true;
            this.style.removeProperty('pointer-events');
            this.style.removeProperty('opacity');
            this.classList.toggle('loaded', true);
            this.$emit('loaded', this, { bubbles: false });
        }

        this.updatePositionClasses();

        if (positionChanged) {
            // emit change event
            this.$emit('positionchange', this, { bubbles: false });
        }
    };

    private getDesiredPosition(
        isHorizontal: boolean,
        positioningMode: AxisPositioningMode,
        inset: boolean,
        defaultPosition: HorizontalPosition | VerticalPosition,
        threshold: number | undefined,
        dimension: Dimension
    ): AnchoredRegionPositionLabel | undefined {
        if (positioningMode === 'uncontrolled') {
            return undefined;
        }

        if (defaultPosition === 'center') {
            return 'center';
        }

        const { startOption, endOption } = this.getPositioningOptions(inset);

        if (defaultPosition !== 'unset') {
            const resolvedPosition = this.resolveToStartOrEndOption(defaultPosition, startOption, endOption, isHorizontal);
            const thereIsEnoughSpace = this.getAvailableSpace(resolvedPosition, dimension) >= (threshold ?? dimension.regionSize);

            if (thereIsEnoughSpace || positioningMode === 'locktodefault') {
                return resolvedPosition;
            }
        }

        return this.choosePositionWithMoreAvailableSpace(startOption, endOption, dimension);
    }

    private adjustForLocalizationDirection(position: StartOrEnd): LeftOrRight {
        return (this.currentDirection === Direction.ltr && position === 'start')
            || (this.currentDirection === Direction.rtl && position === 'end')
            ? 'left'
            : 'right';
    }

    private choosePositionWithMoreAvailableSpace(
        startOption: 'start' | 'insetStart',
        endOption: 'end' | 'insetEnd',
        dimension: Dimension
    ): AnchoredRegionPositionLabel {
        const spaceAtStart = this.getAvailableSpace(startOption, dimension);
        const spaceAtEnd = this.getAvailableSpace(endOption, dimension);
        return spaceAtStart > spaceAtEnd
            ? startOption
            : endOption;
    }

    private resolveToStartOrEndOption(
        defaultPosition: ConcretePosition | StartOrEnd,
        startOption: StartPositionLabel,
        endOption: EndPositionLabel,
        horizontal: boolean
    ): VirtualPositionLabel {
        const position = horizontal && (defaultPosition === 'start' || defaultPosition === 'end')
            ? this.adjustForLocalizationDirection(defaultPosition)
            : defaultPosition;

        switch (position) {
            case 'start':
            case 'left':
            case 'top':
                return startOption;
            case 'end':
            case 'right':
            case 'bottom':
                return endOption;
            default:
                throw new Error(`Unexpected value: ${String(position satisfies never)}`);
        }
    }

    /**
     *  Updates the style string applied to the region element as well as the css classes attached
     *  to the root element
     */
    private readonly updateRegionStyle = (): void => {
        this.style.width = this.regionWidth!;
        this.style.height = this.regionHeight!;
        this.style.transform = `translate(${this.translateX}px, ${this.translateY}px)`;
    };

    /**
     *  Updates the css classes that reflect the current position of the element
     */
    private readonly updatePositionClasses = (): void => {
        this.classList.toggle('top', this.verticalPosition === 'start');
        this.classList.toggle('bottom', this.verticalPosition === 'end');
        this.classList.toggle('inset-top', this.verticalPosition === 'insetStart');
        this.classList.toggle('inset-bottom', this.verticalPosition === 'insetEnd');
        this.classList.toggle('vertical-center', this.verticalPosition === 'center');

        this.classList.toggle('left', this.horizontalPosition === 'start');
        this.classList.toggle('right', this.horizontalPosition === 'end');
        this.classList.toggle('inset-left', this.horizontalPosition === 'insetStart');
        this.classList.toggle('inset-right', this.horizontalPosition === 'insetEnd');
        this.classList.toggle('horizontal-center', this.horizontalPosition === 'center');
    };

    private readonly setDimensionPosition = (
        desiredPosition: AnchoredRegionPositionLabel,
        initialRegionSize: number,
        scaling: AxisScalingMode,
        viewportLock: boolean,
        baseOffset: number,
        dimension: Dimension
    ): { regionSize: string, translation: number } => {
        let nextRegionSize = 0;
        let regionSizeCssValue = '';

        switch (scaling) {
            case 'anchor':
            case 'fill':
                nextRegionSize = viewportLock
                    ? dimension.viewportEnd - dimension.viewportStart
                    : initialRegionSize;
                regionSizeCssValue = `${nextRegionSize}px`;
                break;

            case 'content':
                nextRegionSize = dimension.regionSize;
                regionSizeCssValue = 'unset';
                break;

            default:
                throw new Error(`Unexpected value: ${String(scaling satisfies never)}`);
        }

        let sizeDelta = 0;
        let translation = 0;

        switch (desiredPosition) {
            case 'start':
                translation = baseOffset - nextRegionSize;
                if (viewportLock && dimension.anchorStart > dimension.viewportEnd) {
                    translation -= (dimension.anchorStart - dimension.viewportEnd);
                }
                break;

            case 'insetStart':
                translation = baseOffset - nextRegionSize + (dimension.anchorEnd - dimension.anchorStart);
                if (viewportLock && dimension.anchorEnd > dimension.viewportEnd) {
                    translation -= (dimension.anchorEnd - dimension.viewportEnd);
                }
                break;

            case 'insetEnd':
                translation = baseOffset;
                if (viewportLock && dimension.anchorStart < dimension.viewportStart) {
                    translation -= (dimension.anchorStart - dimension.viewportStart);
                }
                break;

            case 'end':
                translation = baseOffset + (dimension.anchorEnd - dimension.anchorStart);
                if (viewportLock && dimension.anchorEnd < dimension.viewportStart) {
                    translation -= (dimension.anchorEnd - dimension.viewportStart);
                }
                break;

            case 'center':
                sizeDelta = ((dimension.anchorEnd - dimension.anchorStart) - nextRegionSize) / 2;
                translation = baseOffset + sizeDelta;
                if (viewportLock) {
                    const regionStart: number = dimension.anchorStart + sizeDelta;
                    const regionEnd: number = dimension.anchorEnd - sizeDelta;

                    if (regionStart < dimension.viewportStart
                        && !(regionEnd > dimension.viewportEnd)
                    ) {
                        translation -= (regionStart - dimension.viewportStart);
                    } else if (regionEnd > dimension.viewportEnd
                        && !(regionStart < dimension.viewportStart)
                    ) {
                        translation -= (regionEnd - dimension.viewportEnd);
                    }
                }
                break;

            default:
                throw new Error(`Unexpected value: ${String(desiredPosition satisfies never)}`);
        }

        return { regionSize: regionSizeCssValue, translation };
    };

    /**
     *  Get available positions based on positioning mode
     */
    private readonly getPositioningOptions = (inset: boolean): { startOption: StartPositionLabel, endOption: EndPositionLabel } => {
        return inset
            ? { startOption: 'insetStart', endOption: 'insetEnd' }
            : { startOption: 'start', endOption: 'end' };
    };

    /**
     *  Get the space available for a particular relative position
     */
    private readonly getAvailableSpace = (positionOption: AnchoredRegionPositionLabel, dimension: Dimension): number => {
        const anchorSpan: number = dimension.anchorEnd - dimension.anchorStart;
        const spaceStart: number = dimension.anchorStart - dimension.viewportStart;
        const spaceEnd: number = dimension.viewportEnd - dimension.anchorEnd;

        switch (positionOption) {
            case 'start':
                return spaceStart;
            case 'insetStart':
                return spaceStart + anchorSpan;
            case 'insetEnd':
                return spaceEnd + anchorSpan;
            case 'end':
                return spaceEnd;
            case 'center':
                return Math.min(spaceStart, spaceEnd) * 2 + anchorSpan;
            default:
                throw new Error(`Unexpected value: ${String(positionOption satisfies never)}`);
        }
    };

    private readonly getDesiredSize = (
        desiredPosition: AnchoredRegionPositionLabel | undefined,
        scaling: AxisScalingMode,
        dimension: Dimension
    ): number => {
        if (desiredPosition !== undefined && scaling === 'fill') {
            return this.getAvailableSpace(desiredPosition, dimension);
        }
        if (scaling === 'anchor') {
            return dimension.anchorEnd - dimension.anchorStart;
        }
        return dimension.regionSize;
    };

    /**
     * starts event listeners that can trigger auto updating
     */
    private readonly startAutoUpdateEventListeners = (): void => {
        window.addEventListener(eventResize, this.update, { passive: true });
        window.addEventListener(eventScroll, this.update, {
            passive: true,
            capture: true,
        });
        if (this.resizeDetector !== null && this.viewportElement !== null) {
            this.resizeDetector.observe(this.viewportElement);
        }
    };

    /**
     * stops event listeners that can trigger auto updating
     */
    private readonly stopAutoUpdateEventListeners = (): void => {
        window.removeEventListener(eventResize, this.update);
        window.removeEventListener(eventScroll, this.update);
        if (this.resizeDetector !== null && this.viewportElement !== null) {
            this.resizeDetector.unobserve(this.viewportElement);
        }
    };

    private anchorChanged(): void {
        if (this.initialLayoutComplete) {
            this.anchorElement = this.getAnchor();
        }
    }

    private viewportChanged(): void {
        if (this.initialLayoutComplete) {
            this.viewportElement = this.getViewport();
        }
    }

    private horizontalPositioningModeChanged(): void {
        this.requestReset();
    }

    private horizontalDefaultPositionChanged(): void {
        this.updateForAttributeChange();
    }

    private horizontalViewportLockChanged(): void {
        this.updateForAttributeChange();
    }

    private horizontalInsetChanged(): void {
        this.updateForAttributeChange();
    }

    private horizontalThresholdChanged(): void {
        this.updateForAttributeChange();
    }

    private horizontalScalingChanged(): void {
        this.updateForAttributeChange();
    }

    private verticalPositioningModeChanged(): void {
        this.requestReset();
    }

    private verticalDefaultPositionChanged(): void {
        this.updateForAttributeChange();
    }

    private verticalViewportLockChanged(): void {
        this.updateForAttributeChange();
    }

    private verticalInsetChanged(): void {
        this.updateForAttributeChange();
    }

    private verticalThresholdChanged(): void {
        this.updateForAttributeChange();
    }

    private verticalScalingChanged(): void {
        this.updateForAttributeChange();
    }

    private fixedPlacementChanged(): void {
        if (this.$fastController.isConnected && this.initialLayoutComplete) {
            this.initialize();
        }
    }

    private autoUpdateModeChanged(
        prevMode: AutoUpdateMode,
        newMode: AutoUpdateMode
    ): void {
        if (this.$fastController.isConnected && this.initialLayoutComplete) {
            if (prevMode === 'auto') {
                this.stopAutoUpdateEventListeners();
            }

            if (newMode === 'auto') {
                this.startAutoUpdateEventListeners();
            }
        }
    }

    private anchorElementChanged(): void {
        this.requestReset();
    }

    private viewportElementChanged(): void {
        if (this.$fastController.isConnected && this.initialLayoutComplete) {
            this.initialize();
        }
    }
}

const nimbleAnchoredRegion = AnchoredRegion.compose({
    baseName: 'anchored-region',
    baseClass: FoundationAnchoredRegion,
    template,
    styles
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(nimbleAnchoredRegion());
export const anchoredRegionTag = 'nimble-anchored-region';