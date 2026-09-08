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

    /** @internal */
    public positionChanged(): void {
        this.position = this.constrain(this.position);
    }

    /** @internal */
    public minChanged(): void {
        this.position = this.constrain(this.position);
    }

    /** @internal */
    public maxChanged(): void {
        this.position = this.constrain(this.position);
    }

    /** @internal */
    public handlePointerDown(event: PointerEvent): boolean {
        if (event.button !== 0) {
            return true;
        }

        event.preventDefault();
        this.pointerId = event.pointerId;
        this.pointerStartPosition = this.position;
        this.resizing = true;
        if (event.pointerId !== -1) {
            (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
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
            this.updatePosition(((event.clientX - bounds.left) / bounds.width) * 100);
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
        switch (event.key) {
            case 'ArrowLeft':
                nextPosition = this.position - this.validStep;
                break;
            case 'ArrowRight':
                nextPosition = this.position + this.validStep;
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
        return Number.isFinite(this.min) ? this.min : 0;
    }

    private get validMax(): number {
        const max = Number.isFinite(this.max) ? this.max : 100;
        return Math.max(this.validMin, max);
    }

    private get validStep(): number {
        return Number.isFinite(this.step) && this.step > 0 ? this.step : 1;
    }

    private constrain(position: number): number {
        const finitePosition = Number.isFinite(position) ? position : 60;
        return Math.min(this.validMax, Math.max(this.validMin, finitePosition));
    }

    private updatePosition(position: number): void {
        const nextPosition = this.constrain(position);
        if (nextPosition !== this.position) {
            this.position = nextPosition;
            this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        }
    }

    private finishResize(): void {
        this.resizing = false;
        this.pointerId = undefined;
        this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    }
}

const okFvSplitter = FvSplitter.compose({
    baseName: 'fv-splitter',
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true
    }
});

DesignSystem.getOrCreate().withPrefix('ok').register(okFvSplitter());
export const fvSplitterTag = 'ok-fv-splitter';