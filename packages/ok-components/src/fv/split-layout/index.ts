import { attr, nullableNumberConverter, observable, volatile } from '@ni/fast-element';
import { DesignSystem, FoundationElement } from '@ni/fast-foundation';
import { styles } from './styles';
import { template } from './template';

declare global {
    interface HTMLElementTagNameMap {
        'ok-fv-split-layout': FvSplitLayout;
    }
}

let nextLayoutId = 0;

function takeLayoutId(): number {
    const id = nextLayoutId;
    nextLayoutId += 1;
    return id;
}

/**
 * A full-height, resizable two-pane layout.
 */
export class FvSplitLayout extends FoundationElement {
    @attr({ converter: nullableNumberConverter })
    public position = 60;

    @attr({ converter: nullableNumberConverter })
    public min = 35;

    @attr({ converter: nullableNumberConverter })
    public max = 75;

    @attr({ attribute: 'min-secondary-pixels', converter: nullableNumberConverter })
    public minSecondaryPixels = 300;

    @attr({ mode: 'boolean' })
    public collapsed = false;

    @attr({ converter: nullableNumberConverter })
    public step = 1;

    @attr({ attribute: 'primary-pane-id' })
    public primaryPaneId = '';

    @attr({ attribute: 'secondary-pane-id' })
    public secondaryPaneId = '';

    /** @internal */
    @observable
    public availableWidth = 0;

    private readonly resizeObserver = new ResizeObserver(entries => {
        this.availableWidth = entries[0]?.contentRect.width ?? 0;
        this.constrainPosition();
    });

    private requestedPosition = this.position;
    private applyingConstrainedPosition = false;
    private requestedPositionResetScheduled = false;
    private positionChangeCallbackVersion = 0;

    public constructor() {
        super();
        const layoutId = takeLayoutId();
        this.primaryPaneId = `ok-fv-split-layout-primary-${layoutId}`;
        this.secondaryPaneId = `ok-fv-split-layout-secondary-${layoutId}`;

        const positionDescriptor = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(this), 'position');
        if (!positionDescriptor?.get || !positionDescriptor.set) {
            return;
        }

        const getPosition = positionDescriptor.get.bind(this) as () => number;
        const setPosition = positionDescriptor.set.bind(this) as (value: number) => void;
        Object.defineProperty(this, 'position', {
            configurable: true,
            enumerable: positionDescriptor.enumerable,
            get: getPosition,
            set: (value: number) => {
                const previousPosition = getPosition();
                const callbackVersion = this.positionChangeCallbackVersion;
                setPosition(value);
                if (!this.applyingConstrainedPosition
                    && callbackVersion === this.positionChangeCallbackVersion
                    && previousPosition === getPosition()) {
                    this.requestedPosition = getPosition();
                }
            }
        });
    }

    public override connectedCallback(): void {
        super.connectedCallback();
        this.resizeObserver.observe(this);
    }

    public override disconnectedCallback(): void {
        this.resizeObserver.disconnect();
        super.disconnectedCallback();
    }

    public positionChanged(): void {
        this.positionChangeCallbackVersion += 1;
        if (!this.applyingConstrainedPosition) {
            this.requestedPosition = this.position;
            this.resetRequestedPositionAfterSynchronousUpdates();
        }
        this.constrainPosition();
    }

    public minChanged(): void {
        this.constrainPosition();
    }

    public maxChanged(): void {
        this.constrainPosition();
    }

    public minSecondaryPixelsChanged(): void {
        this.constrainPosition();
    }

    public collapsedChanged(): void {
        this.constrainPosition();
    }

    /** @internal */
    public get effectiveMin(): number {
        const configured = Number.isFinite(this.min) ? Math.min(100, Math.max(0, this.min)) : 35;
        return Math.min(configured, this.effectiveMax);
    }

    /** @internal */
    @volatile
    public get effectiveMax(): number {
        const minimum = Number.isFinite(this.min) ? Math.min(100, Math.max(0, this.min)) : 35;
        const configured = Number.isFinite(this.max)
            ? Math.min(100, Math.max(minimum, this.max))
            : Math.max(minimum, 75);
        if (this.availableWidth <= 2 || !Number.isFinite(this.minSecondaryPixels) || this.minSecondaryPixels <= 0) {
            return configured;
        }
        const pixelMaximum = 100 * (1 - this.minSecondaryPixels / (this.availableWidth - 2));
        return Math.max(0, Math.min(configured, pixelMaximum));
    }

    /** @internal */
    @volatile
    public get gridTemplateColumns(): string {
        const secondaryMinimum = Number.isFinite(this.minSecondaryPixels)
            ? Math.max(0, this.minSecondaryPixels)
            : 300;
        return this.collapsed
            ? 'minmax(0, 1fr)'
            : `minmax(0, ${this.position}fr) 2px minmax(${secondaryMinimum}px, ${100 - this.position}fr)`;
    }

    /** @internal */
    public handleSplitterInput(event: Event): boolean {
        event.stopPropagation();
        this.position = (event.currentTarget as HTMLElementTagNameMap['ok-fv-splitter']).position;
        this.$emit('input');
        return true;
    }

    /** @internal */
    public handleSplitterChange(event: Event): boolean {
        event.stopPropagation();
        this.$emit('change');
        return true;
    }

    private constrainPosition(): void {
        if (this.collapsed) {
            return;
        }
        const finitePosition = Number.isFinite(this.requestedPosition) ? this.requestedPosition : 60;
        const constrained = Math.min(this.effectiveMax, Math.max(this.effectiveMin, finitePosition));
        if (constrained !== this.position) {
            this.applyingConstrainedPosition = true;
            this.position = constrained;
            this.applyingConstrainedPosition = false;
        }
    }

    private resetRequestedPositionAfterSynchronousUpdates(): void {
        if (this.requestedPositionResetScheduled) {
            return;
        }
        this.requestedPositionResetScheduled = true;
        queueMicrotask(() => {
            this.requestedPositionResetScheduled = false;
            this.requestedPosition = this.position;
        });
    }
}

const okFvSplitLayout = FvSplitLayout.compose({
    baseName: 'fv-split-layout',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('ok').register(okFvSplitLayout());
export const fvSplitLayoutTag = 'ok-fv-split-layout';
