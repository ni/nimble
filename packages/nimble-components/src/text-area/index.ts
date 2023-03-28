import { attr } from '@microsoft/fast-element';
import {
    DesignSystem,
    TextArea as FoundationTextArea
} from '@microsoft/fast-foundation';
import type { IconExclamationMark } from '../icons/exclamation-mark';
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
     * A reference to the internal error icon element
     * @internal
     */
    public errorIcon!: IconExclamationMark;

    private resizeObserver?: ResizeObserver;

    /**
     * @internal
     */
    public override connectedCallback(): void {
        super.connectedCallback();
        this.resizeObserver = new ResizeObserver(this.onResize);
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
        this.updateScrollbarWidth();
    }

    private readonly onResize = (): void => {
        this.updateScrollbarWidth();
    };

    private updateScrollbarWidth(): void {
        this.errorIcon.style.setProperty(
            '--ni-private-scrollbar-width',
            `${this.control.offsetWidth - this.control.clientWidth}px`
        );
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
