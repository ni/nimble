import { attr, DOM, observable } from '@microsoft/fast-element';
import {
    DesignSystem,
    TextArea as FoundationTextArea
} from '@microsoft/fast-foundation';
import type { ErrorPattern } from '../patterns/error/types';
import { styles } from './styles';
import { template } from './template';
import { TextAreaAppearance } from './types';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-text-area': TextArea;
    }
}

/**
 * A nimble-styed HTML text area
 */
export class TextArea extends FoundationTextArea implements ErrorPattern {
    /**
     * The appearance the text area should have.
     *
     * @public
     * @remarks
     * HTML Attribute: appearance
     */
    @attr
    public appearance: TextAreaAppearance = TextAreaAppearance.outline;

    /**
     * A message explaining why the value is invalid.
     *
     * @public
     * @remarks
     * HTML Attribute: error-text
     */
    @attr({ attribute: 'error-text' })
    public errorText?: string;

    /**
     * Whether to display the error state.
     *
     * @public
     * @remarks
     * HTML Attribute: error-visible
     */
    @attr({ attribute: 'error-visible', mode: 'boolean' })
    public errorVisible = false;

    /**
     * The width of the vertical scrollbar, if displayed.
     * @internal
     */
    @observable
    public scrollbarWidth = -1;

    private resizeObserver?: ResizeObserver;
    private updateScrollbarWidthQueued = false;

    /**
     * @internal
     */
    public override connectedCallback(): void {
        super.connectedCallback();
        this.resizeObserver = new ResizeObserver(() => this.onResize());
        this.resizeObserver.observe(this);
    }

    /**
     * @internal
     */
    public override disconnectedCallback(): void {
        this.resizeObserver?.disconnect();
    }

    /**
     * @internal
     */
    public onTextAreaInput(): void {
        this.handleTextInput();
        this.queueUpdateScrollbarWidth();
    }

    // If a property can affect whether a scrollbar is visible, we need to
    // call queueUpdateScrollbarWidth() when it changes. The exceptions are
    // properties that affect size (e.g. height, width, cols, rows), because
    // we already have a ResizeObserver handling those changes. Also,
    // a change to errorVisible cannot cause scrollbar visibility to change,
    // because we always reserve space for the error icon.

    /**
     * @internal
     */
    public placeholderChanged(): void {
        this.queueUpdateScrollbarWidth();
    }

    /**
     * @internal
     */
    public override valueChanged(previous: string, next: string): void {
        super.valueChanged(previous, next);
        this.queueUpdateScrollbarWidth();
    }

    private onResize(): void {
        // Do this directly instead of calling updateScrollbarWidth, b/c we don't want to
        // interfere with queue.
        this.scrollbarWidth = this.control.offsetWidth - this.control.clientWidth;
    }

    private queueUpdateScrollbarWidth(): void {
        if (!this.$fastController.isConnected) {
            return;
        }
        if (!this.updateScrollbarWidthQueued) {
            this.updateScrollbarWidthQueued = true;
            DOM.queueUpdate(() => this.updateScrollbarWidth());
        }
    }

    private updateScrollbarWidth(): void {
        this.updateScrollbarWidthQueued = false;
        this.scrollbarWidth = this.control.offsetWidth - this.control.clientWidth;
    }
}

const nimbleTextArea = TextArea.compose({
    baseName: 'text-area',
    baseClass: FoundationTextArea,
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true
    }
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTextArea());
export const textAreaTag = DesignSystem.tagFor(TextArea);
