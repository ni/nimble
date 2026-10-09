import { attr, nullableNumberConverter, observable } from '@ni/fast-element';
import { DesignSystem, FoundationElement } from '@ni/fast-foundation';
import { styles } from './styles';
import { template } from './template';

declare global {
    interface HTMLElementTagNameMap {
        'ok-fv-splitter': FvSplitter;
    }
}

/**
 * A vertical separator that enables pointer and keyboard resizing between two panes.
 */
export class FvSplitter extends FoundationElement {
    /** The accessible name for the separator. */
    @attr({ attribute: 'aria-label' })
    public override ariaLabel = 'Resize panes';

    /** Identifies the element that labels the separator. */
    @attr({ attribute: 'aria-labelledby' })
    public ariaLabelledby: string | undefined;

    /** Identifies the primary pane controlled by the separator. */
    @attr({ attribute: 'aria-controls' })
    public ariaControls: string | undefined;

    /** The splitter position as a percentage of the containing layout's width. */
    @attr({ converter: nullableNumberConverter })
    public position = 60;

    /** The minimum allowed position. */
    @attr({ converter: nullableNumberConverter })
    public min = 0;

    /** The maximum allowed position. */
    @attr({ converter: nullableNumberConverter })
    public max = 100;

    /** The percentage-point increment used for keyboard resizing. */
    @attr({ converter: nullableNumberConverter })
    public step = 1;

    /** @internal */
    @observable
    public resizing = false;

    private pointerId: number | undefined;
    private pointerStartPosition = 0;
    private requestedPosition = this.position;
    private applyingConstrainedPosition = false;
    private requestedPositionResetScheduled = false;
    private positionChangeCallbackVersion = 0;

    public constructor() {
        super();

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

    /** @internal */
    public override connectedCallback(): void {
        super.connectedCallback();

        this.setAttribute('role', 'separator');
        this.setAttribute('aria-orientation', 'vertical');
        this.setAttribute('aria-label', this.ariaLabel);
        this.tabIndex = 0;
        this.addEventListener('keydown', this.keydownHandler);
        this.syncAriaValueAttributes();
    }

    /** @internal */
    public override disconnectedCallback(): void {
        this.removeEventListener('keydown', this.keydownHandler);
        super.disconnectedCallback();
    }

    /** @internal */
    public positionChanged(): void {
        this.positionChangeCallbackVersion += 1;
        if (!this.applyingConstrainedPosition) {
            this.requestedPosition = this.position;
            this.resetRequestedPositionAfterSynchronousUpdates();
        }
        this.applyConstrainedPosition();
    }

    /** @internal */
    public minChanged(): void {
        this.applyConstrainedPosition();
    }

    /** @internal */
    public maxChanged(): void {
        this.applyConstrainedPosition();
    }

    /** @internal */
    public resizingChanged(): void {
        this.toggleAttribute('resizing', this.resizing);
    }

    /** @internal */
    public handlePointerDown(event: PointerEvent): boolean {
        if (event.button !== 0 || !event.isPrimary || this.pointerId !== undefined) {
            return true;
        }

        event.preventDefault();
        const pointerTarget = event.currentTarget as HTMLElement;
        this.focus();
        this.pointerId = event.pointerId;
        this.pointerStartPosition = this.position;
        this.resizing = true;
        if (event.pointerId !== -1) {
            pointerTarget.setPointerCapture(event.pointerId);
        }
        return true;
    }

    /** @internal */
    public handlePointerMove(event: PointerEvent): boolean {
        if (event.pointerId !== this.pointerId) {
            return true;
        }

        const container = this.parentElement;
        if (!container) {
            return true;
        }

        const bounds = container.getBoundingClientRect();
        if (bounds.width > 0) {
            const distanceFromInlineStart = this.isRtl
                ? bounds.right - event.clientX
                : event.clientX - bounds.left;
            this.updatePosition((distanceFromInlineStart / bounds.width) * 100);
        }
        return true;
    }

    /** @internal */
    public handlePointerUp(event: PointerEvent): boolean {
        if (event.pointerId === this.pointerId) {
            this.finishResize();
        }
        return true;
    }

    /** @internal */
    public handlePointerCancel(event: PointerEvent): boolean {
        if (event.pointerId === this.pointerId) {
            this.updatePosition(this.pointerStartPosition);
            this.resizing = false;
            this.pointerId = undefined;
        }
        return true;
    }

    /** @internal */
    public handleKeyDown(event: KeyboardEvent): boolean {
        let nextPosition: number | undefined;
        const direction = this.isRtl ? -1 : 1;
        switch (event.key) {
            case 'ArrowLeft':
                nextPosition = this.position - direction * this.validStep;
                break;
            case 'ArrowRight':
                nextPosition = this.position + direction * this.validStep;
                break;
            case 'Home':
                nextPosition = this.validMin;
                break;
            case 'End':
                nextPosition = this.validMax;
                break;
            default:
                return true;
        }

        event.preventDefault();
        const previousPosition = this.position;
        this.updatePosition(nextPosition);
        if (this.position !== previousPosition) {
            this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
        }
        return true;
    }

    private get validMin(): number {
        return Number.isFinite(this.min) ? Math.min(100, Math.max(0, this.min)) : 0;
    }

    private get validMax(): number {
        const max = Number.isFinite(this.max) ? this.max : 100;
        return Math.max(this.validMin, Math.min(100, Math.max(0, max)));
    }

    private get validStep(): number {
        return Number.isFinite(this.step) && this.step > 0 ? this.step : 1;
    }

    private get isRtl(): boolean {
        return getComputedStyle(this).direction === 'rtl';
    }

    private readonly keydownHandler = (event: KeyboardEvent): void => {
        this.handleKeyDown(event);
    };

    private constrain(position: number): number {
        const finitePosition = Number.isFinite(position) ? position : 60;
        return Math.min(this.validMax, Math.max(this.validMin, finitePosition));
    }

    private updatePosition(position: number): void {
        const nextPosition = this.constrain(position);
        this.requestedPosition = nextPosition;
        if (nextPosition !== this.position) {
            this.position = nextPosition;
            this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        }
    }

    private applyConstrainedPosition(): void {
        const constrainedPosition = this.constrain(this.requestedPosition);
        if (constrainedPosition !== this.position) {
            this.applyingConstrainedPosition = true;
            this.position = constrainedPosition;
            this.applyingConstrainedPosition = false;
        }
        this.syncAriaValueAttributesIfConnected();
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

    private finishResize(): void {
        const changed = this.position !== this.pointerStartPosition;
        this.resizing = false;
        this.pointerId = undefined;
        if (changed) {
            this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
        }
    }

    private syncAriaValueAttributesIfConnected(): void {
        if (this.$fastController.isConnected) {
            this.syncAriaValueAttributes();
        }
    }

    private syncAriaValueAttributes(): void {
        this.setAttribute('aria-valuemin', String(this.validMin));
        this.setAttribute('aria-valuemax', String(this.validMax));
        this.setAttribute('aria-valuenow', String(this.position));
        this.setAttribute('aria-valuetext', `${this.position} percent`);
    }
}

const okFvSplitter = FvSplitter.compose({
    baseName: 'fv-splitter',
    template,
    styles,
    shadowOptions: {
        delegatesFocus: false
    }
});

DesignSystem.getOrCreate().withPrefix('ok').register(okFvSplitter());
export const fvSplitterTag = 'ok-fv-splitter';