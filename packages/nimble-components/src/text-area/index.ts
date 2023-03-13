import { attr, observable } from '@microsoft/fast-element';
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
     * @internal
     */
    @observable
    public hasVerticalScrollbar = false;

    private resizeObserver?: ResizeObserver;

    public override connectedCallback(): void {
        super.connectedCallback();
        this.resizeObserver = new ResizeObserver(this.onResize);
        this.resizeObserver.observe(this);
    }

    public override disconnectedCallback(): void {
        this.resizeObserver?.disconnect();
    }

    public onTextAreaInput(): void {
        this.handleTextInput();
        this.updateHasVerticalScrollbar();
    }

    private readonly onResize = (): void => {
        this.updateHasVerticalScrollbar();
    };

    private updateHasVerticalScrollbar(): void {
        this.hasVerticalScrollbar = this.control.clientHeight < this.control.scrollHeight;
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
